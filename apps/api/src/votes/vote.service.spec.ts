import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { VotesService } from './vote.service';
import { TechnologiesService } from '../technologies/technology.service';
import { Vote } from './vote.entity';
import { Technology } from '../technologies/technology.entity';

describe('VotesService', () => {
  let votesService: VotesService;
  let technologiesService: TechnologiesService;

  const mockVote = {
    id: 1,
    userId: 1,
    technologyId: 1,
    score: 4,
    comment: 'Great!',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTechnology = {
    id: 1,
    name: 'NestJS',
    description: 'A Node.js framework',
    avgScore: 0,
    voteCount: 0,
    categoryId: 1,
  };

  const mockVotesRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockTechnologiesRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        TechnologiesService,
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

    votesService = module.get<VotesService>(VotesService);
    technologiesService = module.get<TechnologiesService>(TechnologiesService);
  });

  it('should create a new vote', async () => {
    mockTechnologiesRepository.findOne.mockResolvedValue(mockTechnology);
    mockVotesRepository.findOne.mockResolvedValue(null);
    mockVotesRepository.create.mockReturnValue(mockVote);
    mockVotesRepository.save.mockResolvedValue(mockVote);

    const result = await votesService.createOrUpdate(1, 1, {
      score: 4,
      comment: 'Great!',
    });

    expect(result.score).toBe(4);
    expect(result.comment).toBe('Great!');
  });

  it('should update an existing vote', async () => {
    const existingVote = { ...mockVote, score: 3 };
    mockTechnologiesRepository.findOne.mockResolvedValue(mockTechnology);
    mockVotesRepository.findOne.mockResolvedValue(existingVote);
    mockVotesRepository.save.mockResolvedValue({ ...existingVote, score: 5 });

    const result = await votesService.createOrUpdate(1, 1, {
      score: 5,
    });

    expect(result.score).toBe(5);
  });

  it('should find votes by technology', async () => {
    mockVotesRepository.find.mockResolvedValue([mockVote]);

    const votes = await votesService.findByTechnology(1);
    expect(votes).toHaveLength(1);
    expect(votes[0].technologyId).toBe(1);
  });

  it('should delete a vote', async () => {
    mockVotesRepository.findOne.mockResolvedValue(mockVote);
    mockVotesRepository.delete.mockResolvedValue({ affected: 1 });

    await expect(votesService.delete(1, 1)).resolves.not.toThrow();
  });
});
