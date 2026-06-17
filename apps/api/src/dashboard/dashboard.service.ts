import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '../votes/vote.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
  ) {}

  async getStats(userId: number) {
    const votes = await this.votesRepository.find({
      where: { userId },
      relations: { technology: { category: true } },
      order: { createdAt: 'DESC' },
    });

    const totalVotes = votes.length;
    const avgScore =
      totalVotes > 0
        ? votes.reduce((sum, v) => sum + v.score, 0) / totalVotes
        : 0;

    const categoriesVoted = new Set(
      votes
        .filter((v) => v.technology?.category)
        .map((v) => v.technology.category.id),
    ).size;

    const lastVoteDate = votes.length > 0 ? votes[0].createdAt : null;

    return {
      totalVotes,
      avgScore: Math.round(avgScore * 100) / 100,
      categoriesVoted,
      lastVoteDate,
    };
  }

  async getMyVotes(userId: number, page: number = 1, limit: number = 10) {
    const [votes, total] = await this.votesRepository.findAndCount({
      where: { userId },
      relations: { technology: { category: true } },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: votes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
