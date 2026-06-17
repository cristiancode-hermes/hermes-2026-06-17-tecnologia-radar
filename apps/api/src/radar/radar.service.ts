import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/category.entity';
import { Technology } from '../technologies/technology.entity';

@Injectable()
export class RadarService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Technology)
    private technologiesRepository: Repository<Technology>,
  ) {}

  async getRadarData() {
    const categories = await this.categoriesRepository.find({
      relations: { technologies: true },
    });

    return {
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
        technologies: cat.technologies.map((tech) => ({
          id: tech.id,
          name: tech.name,
          avgScore: tech.avgScore,
          voteCount: tech.voteCount,
          trend: tech.trend,
        })),
      })),
    };
  }
}
