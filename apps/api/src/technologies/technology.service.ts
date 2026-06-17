import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThanOrEqual } from 'typeorm';
import { Technology } from './technology.entity';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(Technology)
    private technologiesRepository: Repository<Technology>,
  ) {}

  async findAll(query: {
    categoryId?: number;
    period?: string;
    minScore?: number;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
    search?: string;
  }): Promise<Technology[]> {
    const where: any = {};

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }
    if (query.minScore !== undefined) {
      where.avgScore = MoreThanOrEqual(query.minScore);
    }
    if (query.search) {
      where.name = Like(`%${query.search}%`);
    }

    const order: any = {};
    if (query.sortBy) {
      order[query.sortBy] = query.order || 'DESC';
    } else {
      order.avgScore = 'DESC';
    }

    const technologies = await this.technologiesRepository.find({
      where,
      order,
      relations: { category: true },
    });

    return technologies;
  }

  async findById(id: number): Promise<Technology> {
    const technology = await this.technologiesRepository.findOne({
      where: { id },
      relations: { category: true, votes: true },
    });
    if (!technology) {
      throw new NotFoundException('Technology not found');
    }
    return technology;
  }

  async create(dto: CreateTechnologyDto): Promise<Technology> {
    const technology = this.technologiesRepository.create(dto);
    return this.technologiesRepository.save(technology);
  }

  async update(id: number, dto: UpdateTechnologyDto): Promise<Technology> {
    const technology = await this.findById(id);
    Object.assign(technology, dto);
    return this.technologiesRepository.save(technology);
  }

  async delete(id: number): Promise<void> {
    const result = await this.technologiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Technology not found');
    }
  }

  async recalcScore(technologyId: number): Promise<void> {
    const technology = await this.technologiesRepository.findOne({
      where: { id: technologyId },
      relations: { votes: true },
    });
    if (!technology) return;

    const votes = technology.votes || [];
    const totalScore = votes.reduce((sum, v) => sum + v.score, 0);
    technology.avgScore = votes.length > 0 ? totalScore / votes.length : 0;
    technology.voteCount = votes.length;
    await this.technologiesRepository.save(technology);
  }
}
