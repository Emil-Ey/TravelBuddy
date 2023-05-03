import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { v4 as uuidv4 } from 'uuid';
import { UserLoginDto } from './auth.dto';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  const uuid = uuidv4();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          // using a factory just because
          useFactory: () => ({
            login: jest.fn((userLoginDto: UserLoginDto) => Promise.resolve({ accessToken: uuid })),
            generateJwt: jest.fn((user: {_id: string, username: string, description: string}) => Promise.resolve({ accessToken: uuid })),
          }),
        },
      ],
    }).compile();

    resolver = app.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('login', () => {
    it('should login and get access token', async () => {
      expect(
        await resolver.login({username: uuidv4(), password: uuidv4()})
      ).toEqual(
        { accessToken: uuid }
      );
    });
  });

  describe('logout', () => {
    it('should logout and return true', async () => {
      expect(
        await resolver.logout()
      ).toEqual(
        true
      );
    });
  });
});
