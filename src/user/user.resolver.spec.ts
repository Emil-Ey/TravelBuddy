import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserResolver } from './user.resolver';

const mockUsers = [
  {
    "_id": "1234",
    "username": "test-username",
    "description": "testing find all users"
  },
]

const jwtServiceMock = {
  decode: jest.fn((jwt: any): object => {  return {id: "1234" }})
};

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        { provide: JwtService, useValue: jwtServiceMock },
        {
          provide: JwtAuthGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should get the users array', () => {
      expect(resolver.users()).toEqual(mockUsers);
    });
  });
});
