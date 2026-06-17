import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Vote } from '../votes/vote.entity';
import { Technology } from '../technologies/technology.entity';

export interface TrendItem {
  technologyId: number;
  currentAvg: number;
  previousAvg: number;
  change: number;
  voteCount: number;
  name?: string;
  description?: string;
}

@Injectable()
export class TrendsService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
    @InjectRepository(Technology)
    private technologiesRepository: Repository<Technology>,
  ) {}

  async getTrends(period: string = 'month', limit: number = 10) {
    const now = new Date();
    let currentStart: Date;
    let previousStart: Date;

    switch (period) {
      case 'week':
        currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStart = new Date(currentStart.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousStart = new Date(currentStart.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        currentStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        previousStart = new Date(currentStart.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousStart = new Date(currentStart.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get current period votes
    const currentVotes = await this.votesRepository
      .createQueryBuilder('vote')
      .select('vote.technologyId', 'technologyId')
      .addSelect('AVG(vote.score)', 'avgScore')
      .addSelect('COUNT(vote.id)', 'voteCount')
      .where('vote.createdAt >= :start', { start: currentStart })
      .groupBy('vote.technologyId')
      .getRawMany();

    // Get previous period votes
    const previousVotes = await this.votesRepository
      .createQueryBuilder('vote')
      .select('vote.technologyId', 'technologyId')
      .addSelect('AVG(vote.score)', 'avgScore')
      .where('vote.createdAt >= :start AND vote.createdAt < :end', {
        start: previousStart,
        end: currentStart,
      })
      .groupBy('vote.technologyId')
      .getRawMany();

    // Map previous scores
    const previousScores: Record<string, number> = {};
    for (const v of previousVotes) {
      previousScores[v.technologyId] = parseFloat(v.avgScore) || 0;
    }

    // Calculate trends
    const trends: TrendItem[] = [];
    for (const v of currentVotes) {
      const techId = parseInt(v.technologyId);
      const currentAvg = parseFloat(v.avgScore) || 0;
      const previousAvg = previousScores[techId] || 0;
      const change = currentAvg - previousAvg;

      trends.push({
        technologyId: techId,
        currentAvg,
        previousAvg,
        change,
        voteCount: parseInt(v.voteCount) || 0,
      });
    }

    // Sort by change descending
    trends.sort((a, b) => b.change - a.change);

    // Limit results
    const limited = trends.slice(0, limit);

    // Enrich with technology names using the repository
    if (limited.length > 0) {
      const techIds = limited.map((t) => t.technologyId);
      const technologies = await this.technologiesRepository.findBy({ id: In(techIds) as any });

      const techMap: Record<number, Technology> = {};
      for (const t of technologies) {
        techMap[t.id] = t;
      }

      for (const t of limited) {
        const tech = techMap[t.technologyId];
        if (tech) {
          t.name = tech.name;
          t.description = tech.description;
        }
      }
    }

    return {
      period,
      rising: limited.filter((t) => t.change > 0),
      declining: limited.filter((t) => t.change < 0).reverse(),
      stable: limited.filter((t) => t.change === 0),
    };
  }
}
