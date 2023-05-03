import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';


describe('AuthService', () => {
  let service: AuthService;

  let uuid = uuidv4();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          // using a factory just because
          useFactory: () => ({
            login: jest.fn((userLoginDto: UserLoginDto) => Promise.resolve({ accessToken: uuid })),
            generateJwt: jest.fn((user: {_id: string, username: string, description: string}) => Promise.resolve({ accessToken: uuid })),
          }),
        },
        {
          provide: JwtService,
          useFactory: () => ({
            
          })
        }
      ],

    service = app.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
