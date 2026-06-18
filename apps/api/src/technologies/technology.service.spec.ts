import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TechnologiesService } from './technology.service';
import { Technology } from './technology.entity';

describe('TechnologiesService', () => {
  let service: TechnologiesService;

  const mockTechnology = {
    id: 1,
    name: 'NestJS',
    description: 'A progressive Node.js framework',
    websiteUrl: 'https://nestjs.com',
    logoUrl: null,
    avgScore: 4.5,
    voteCount: 10,
    trend: 0,
    categoryId: 1,
    category: { id: 1, name: 'Frameworks' },
    votes: [
      { id: 1, score: 5, userId: 1, technologyId: 1 },
      { id: 2, score: 4, userId: 2, technologyId: 1 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTechnologiesRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechnologiesService,
        {
          provide: getRepositoryToken(Technology),
          useValue: mockTechnologiesRepository,
        },
      ],
    }).compile();

    service = module.get<TechnologiesService>(TechnologiesService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all technologies with default ordering by avgScore DESC', async () => {
      mockTechnologiesRepository.find.mockResolvedValue([mockTechnology]);

      const result = await service.findAll({});

      expect(mockTechnologiesRepository.find).toHaveBeenCalledWith({
        where: {},
        order: { avgScore: 'DESC' },
        relations: { category: true },
      });
      expect(result).toEqual([mockTechnology]);
    });

    it('should filter by categoryId when provided', async () => {
      const categoryFiltered = { ...mockTechnology, categoryId: 2 };
      mockTechnologiesRepository.find.mockResolvedValue([categoryFiltered]);

      const result = await service.findAll({ categoryId: 2 });

      expect(mockTechnologiesRepository.find).toHaveBeenCalledWith({
        where: { categoryId: 2 },
        order: { avgScore: 'DESC' },
        relations: { category: true },
      });
      expect(result).toHaveLength(1);
      expect(result[0].categoryId).toBe(2);
    });

    it('should filter by minScore when provided', async () => {
      mockTechnologiesRepository.find.mockResolvedValue([mockTechnology]);

      await service.findAll({ minScore: 3 });

      expect(mockTechnologiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            avgScore: expect.anything(),
          }),
        }),
      );
    });

    it('should search by name when search term is provided', async () => {
      mockTechnologiesRepository.find.mockResolvedValue([mockTechnology]);

      await service.findAll({ search: 'Nest' });

      expect(mockTechnologiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: expect.anything(),
          }),
        }),
      );
    });

    it('should use custom sortBy and order when provided', async () => {
      mockTechnologiesRepository.find.mockResolvedValue([mockTechnology]);

      await service.findAll({ sortBy: 'name', order: 'ASC' });

      expect(mockTechnologiesRepository.find).toHaveBeenCalledWith({
        where: {},
        order: { name: 'ASC' },
        relations: { category: true },
      });
    });
  });

  describe('findById', () => {
    it('should return a technology by id', async () => {
      mockTechnologiesRepository.findOne.mockResolvedValue(mockTechnology);

      const result = await service.findById(1);

      expect(mockTechnologiesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { category: true, votes: true },
      });
      expect(result).toEqual(mockTechnology);
    });

    it('should throw NotFoundException when technology is not found', async () => {
      mockTechnologiesRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      expect(mockTechnologiesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: { category: true, votes: true },
      });
    });
  });

  describe('create', () => {
    it('should create and save a new technology', async () => {
      const createDto = {
        name: 'Express',
        description: 'Fast web framework for Node.js',
        categoryId: 1,
        websiteUrl: 'https://expressjs.com',
      };

      const created = { ...mockTechnology, id: 2, name: 'Express' };
      mockTechnologiesRepository.create.mockReturnValue(created);
      mockTechnologiesRepository.save.mockResolvedValue(created);

      const result = await service.create(createDto);

      expect(mockTechnologiesRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockTechnologiesRepository.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('should update an existing technology', async () => {
      const updateDto = { name: 'NestJS Updated' };
      const updatedTechnology = { ...mockTechnology, ...updateDto };

      mockTechnologiesRepository.findOne.mockResolvedValue(mockTechnology);
      mockTechnologiesRepository.save.mockResolvedValue(updatedTechnology);

      const result = await service.update(1, updateDto);

      expect(mockTechnologiesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { category: true, votes: true },
      });
      expect(mockTechnologiesRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('NestJS Updated');
    });

    it('should throw NotFoundException when updating non-existent technology', async () => {
      mockTechnologiesRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Ghost' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a technology by id', async () => {
      mockTechnologiesRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.delete(1)).resolves.not.toThrow();
      expect(mockTechnologiesRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when deleting non-existent technology', async () => {
      mockTechnologiesRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
      expect(mockTechnologiesRepository.delete).toHaveBeenCalledWith(999);
    });
  });

  describe('recalcScore', () => {
    it('should recalculate avgScore and voteCount from votes', async () => {
      const technologyWithVotes = {
        ...mockTechnology,
        votes: [
          { id: 1, score: 5 },
          { id: 2, score: 4 },
          { id: 3, score: 3 },
        ],
      };
      mockTechnologiesRepository.findOne.mockResolvedValue(
        technologyWithVotes,
      );
      mockTechnologiesRepository.save.mockResolvedValue(technologyWithVotes);

      await service.recalcScore(1);

      expect(mockTechnologiesRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { votes: true },
      });
      expect(mockTechnologiesRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          avgScore: 4, // (5 + 4 + 3) / 3 = 4
          voteCount: 3,
        }),
      );
    });

    it('should set avgScore to 0 when there are no votes', async () => {
      const technologyWithoutVotes = {
        ...mockTechnology,
        votes: [],
      };
      mockTechnologiesRepository.findOne.mockResolvedValue(
        technologyWithoutVotes,
      );
      mockTechnologiesRepository.save.mockResolvedValue(
        technologyWithoutVotes,
      );

      await service.recalcScore(1);

      expect(mockTechnologiesRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          avgScore: 0,
          voteCount: 0,
        }),
      );
    });

    it('should handle undefined votes gracefully', async () => {
      const technologyNoVotes = {
        ...mockTechnology,
        votes: undefined,
      };
      mockTechnologiesRepository.findOne.mockResolvedValue(technologyNoVotes);
      mockTechnologiesRepository.save.mockResolvedValue(technologyNoVotes);

      await service.recalcScore(1);

      expect(mockTechnologiesRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          avgScore: 0,
          voteCount: 0,
        }),
      );
    });

    it('should do nothing if technology is not found', async () => {
      mockTechnologiesRepository.findOne.mockResolvedValue(null);

      await service.recalcScore(999);

      expect(mockTechnologiesRepository.save).not.toHaveBeenCalled();
    });
  });
});
