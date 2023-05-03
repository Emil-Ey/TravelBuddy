import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
const argon2 = require('argon2');
type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('AuthService', () => {
  let service: AuthService;
  const userServiceMock: MockType<UserService> = {
    findOneByUsername: jest.fn(),
  };

  const userId = uuidv4();
  const username = uuidv4();
  const password = uuidv4();
  let hashedPassword: string;
  const description = uuidv4();
  const token = uuidv4();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userServiceMock
        },
        {
          provide: JwtService,
          useFactory: () => ({
            sign: jest.fn((payload: {
              id: string,
              username: string,
              description: string
            }) => token)
          })
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should login with correct username and password', async () => {
      hashedPassword = await argon2.hash(password);
      const returnUser = Promise.resolve({ _id: userId, username: username, password: hashedPassword, description: description });
      userServiceMock.findOneByUsername.mockReturnValue(returnUser)

      expect(
        await service.login({username: username, password: password})
      ).toEqual(
        { accessToken: token }
      );
    });
  });

  describe('login', () => {
    it('should reject login with wrong password', async () => {
      hashedPassword = await argon2.hash(uuidv4());
      const returnUser = Promise.resolve({ _id: userId, username: username, password: hashedPassword, description: description });
      userServiceMock.findOneByUsername.mockReturnValue(returnUser)

      await expect(service.login({username: username, password: password}))
        .rejects.toEqual(new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED));
    });
  });
});
