import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { TechnologiesService } from '../technologies/technology.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
    private technologiesService: TechnologiesService,
  ) {}

  async createOrUpdate(
    technologyId: number,
    userId: number,
    dto: CreateVoteDto,
  ): Promise<Vote> {
    // Check technology exists
    await this.technologiesService.findById(technologyId);

    // Upsert pattern: find existing vote
    let vote = await this.votesRepository.findOne({
      where: { userId, technologyId },
    });

    if (vote) {
      // Update existing
      vote.score = dto.score;
      if (dto.comment !== undefined) {
        vote.comment = dto.comment;
      }
    } else {
      // Create new
      vote = this.votesRepository.create({
        userId,
        technologyId,
        score: dto.score,
        comment: dto.comment,
      });
    }

    vote = await this.votesRepository.save(vote);
    await this.technologiesService.recalcScore(technologyId);
    return vote;
  }

  async findByTechnology(technologyId: number): Promise<Vote[]> {
    return this.votesRepository.find({
      where: { technologyId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Vote[]> {
    return this.votesRepository.find({
      where: { userId },
      relations: { technology: { category: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, userId: number, dto: UpdateVoteDto): Promise<Vote> {
    const vote = await this.votesRepository.findOne({
      where: { id },
      relations: { technology: true },
    });
    if (!vote) {
      throw new NotFoundException('Vote not found');
    }
    if (vote.userId !== userId) {
      throw new ForbiddenException('You can only update your own votes');
    }
    if (dto.score !== undefined) {
      vote.score = dto.score;
    }
    if (dto.comment !== undefined) {
      vote.comment = dto.comment;
    }
    const saved = await this.votesRepository.save(vote);
    await this.technologiesService.recalcScore(vote.technologyId);
    return saved;
  }

  async delete(id: number, userId: number): Promise<void> {
    const vote = await this.votesRepository.findOne({ where: { id } });
    if (!vote) {
      throw new NotFoundException('Vote not found');
    }
    if (vote.userId !== userId) {
      throw new ForbiddenException('You can only delete your own votes');
    }
    await this.votesRepository.delete(id);
    await this.technologiesService.recalcScore(vote.technologyId);
  }

  async findByTechnologyId(technologyId: number): Promise<Vote[]> {
    return this.votesRepository.find({
      where: { technologyId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }
}
