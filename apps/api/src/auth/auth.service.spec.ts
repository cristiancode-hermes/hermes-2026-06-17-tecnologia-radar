import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/user.service';
import { User } from '../users/user.entity';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'hashedPassword123',
    name: 'Test User',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should register a new user', async () => {
    mockUsersRepository.findOne.mockResolvedValue(null);
    mockUsersRepository.create.mockReturnValue(mockUser);
    mockUsersRepository.save.mockResolvedValue(mockUser);

    const result = await authService.register({
      email: 'test@test.com',
      password: 'password123',
      name: 'Test User',
    });

    expect(result.access_token).toBe('mock-jwt-token');
    expect(result.user.email).toBe('test@test.com');
  });

  it('should throw ConflictException on duplicate email', async () => {
    mockUsersRepository.findOne.mockResolvedValue(mockUser);

    await expect(
      authService.register({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should login with valid credentials', async () => {
    mockUsersRepository.findOne.mockResolvedValue(mockUser);

    const result = await authService.login({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result.access_token).toBe('mock-jwt-token');
    expect(result.user.email).toBe('test@test.com');
  });

  it('should throw UnauthorizedException on invalid credentials', async () => {
    mockUsersRepository.findOne.mockResolvedValue(null);

    await expect(
      authService.login({
        email: 'wrong@test.com',
        password: 'wrong',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should get user profile', async () => {
    mockUsersRepository.findOne.mockResolvedValue(mockUser);

    const profile = await authService.getProfile(1);
    expect(profile.email).toBe('test@test.com');
    expect(profile).not.toHaveProperty('password');
  });
});
