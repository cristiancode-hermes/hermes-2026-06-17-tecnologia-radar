import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { Vote } from '../votes/vote.entity';

describe('DashboardService', () => {
  let service: DashboardService;

  const baseVote = {
    id: 1,
    score: 4,
    comment: 'Great technology',
    userId: 1,
    technologyId: 1,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  };

  const mockVotesRepository = {
    find: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Vote),
          useValue: mockVotesRepository,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);

    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('should return empty stats when user has no votes', async () => {
      mockVotesRepository.find.mockResolvedValue([]);

      const result = await service.getStats(1);

      expect(mockVotesRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: { technology: { category: true } },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual({
        totalVotes: 0,
        avgScore: 0,
        categoriesVoted: 0,
        lastVoteDate: null,
      });
    });

    it('should calculate totalVotes and avgScore correctly', async () => {
      const vote1 = {
        ...baseVote,
        id: 1,
        score: 5,
        technology: {
          id: 1,
          name: 'NestJS',
          category: { id: 1, name: 'Frameworks' },
        },
      };
      const vote2 = {
        ...baseVote,
        id: 2,
        score: 3,
        technology: {
          id: 2,
          name: 'React',
          category: { id: 2, name: 'Frontend' },
        },
      };
      const vote3 = {
        ...baseVote,
        id: 3,
        score: 4,
        technology: {
          id: 3,
          name: 'PostgreSQL',
          category: { id: 2, name: 'Frontend' },
        },
      };

      mockVotesRepository.find.mockResolvedValue([vote1, vote2, vote3]);

      const result = await service.getStats(1);

      expect(result.totalVotes).toBe(3);
      // (5 + 3 + 4) / 3 = 4.0, rounded to 4.00
      expect(result.avgScore).toBe(4.0);
      // Two distinct categories: {1, 2}
      expect(result.categoriesVoted).toBe(2);
      // Most recent first (returned in DESC order)
      expect(result.lastVoteDate).toEqual(vote1.createdAt);
    });

    it('should handle votes without a category gracefully', async () => {
      const voteNoCategory = {
        ...baseVote,
        score: 4,
        technology: {
          id: 1,
          name: 'NestJS',
          category: null,
        },
      };
      const voteWithCategory = {
        ...baseVote,
        id: 2,
        score: 3,
        technology: {
          id: 2,
          name: 'React',
          category: { id: 1, name: 'Frameworks' },
        },
      };

      mockVotesRepository.find.mockResolvedValue([
        voteNoCategory,
        voteWithCategory,
      ]);

      const result = await service.getStats(1);

      expect(result.totalVotes).toBe(2);
      // (4 + 3) / 2 = 3.5
      expect(result.avgScore).toBe(3.5);
      // Only 1 vote has a valid category
      expect(result.categoriesVoted).toBe(1);
    });

    it('should round avgScore to 2 decimal places', async () => {
      const vote1 = { ...baseVote, id: 1, score: 4, technology: { category: { id: 1 } } };
      const vote2 = { ...baseVote, id: 2, score: 3, technology: { category: { id: 2 } } };
      const vote3 = { ...baseVote, id: 3, score: 3, technology: { category: { id: 1 } } };

      mockVotesRepository.find.mockResolvedValue([vote1, vote2, vote3]);

      const result = await service.getStats(1);

      // (4 + 3 + 3) / 3 = 3.333..., rounded to 2 decimals = 3.33
      expect(result.avgScore).toBe(3.33);
    });
  });
});
