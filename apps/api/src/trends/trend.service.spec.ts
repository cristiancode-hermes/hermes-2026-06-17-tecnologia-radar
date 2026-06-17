import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TrendsService } from './trend.service';
import { Vote } from '../votes/vote.entity';
import { Technology } from '../technologies/technology.entity';

describe('TrendsService', () => {
  let trendsService: TrendsService;

  const mockVotesRepository = {
    createQueryBuilder: jest.fn(),
  };

  const mockTechnologiesRepository = {
    findBy: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrendsService,
        {
          provide: getRepositoryToken(Vote),
          useValue: mockVotesRepository,
        },
        {
          provide: getRepositoryToken(Technology),
          useValue: mockTechnologiesRepository,
        },
      ],
    }).compile();

    trendsService = module.get<TrendsService>(TrendsService);

    // Mock query builder chain for votes
    const mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    };

    mockVotesRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  it('should get trends with month period', async () => {
    const trends = await trendsService.getTrends('month', 10);
    expect(trends).toHaveProperty('period', 'month');
    expect(trends).toHaveProperty('rising');
    expect(trends).toHaveProperty('declining');
    expect(trends).toHaveProperty('stable');
  });

  it('should return empty trends when no votes exist', async () => {
    const trends = await trendsService.getTrends('month', 10);
    expect(trends.rising).toHaveLength(0);
    expect(trends.declining).toHaveLength(0);
    expect(trends.stable).toHaveLength(0);
  });

  it('should support week period filtering', async () => {
    const trends = await trendsService.getTrends('week', 5);
    expect(trends.period).toBe('week');
  });
});
