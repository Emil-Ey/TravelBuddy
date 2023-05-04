import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { CommentService } from 'src/comment/comment.service';
import { TripService } from 'src/trip/trip.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';
const fs = require('fs');
jest.mock('fs')
type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('UserResolver', () => {
  let resolver: UserResolver;
  const userId = uuidv4();
  const username = uuidv4();
  const token = uuidv4();
  const context = { req: { headers: { authorization: "Bearer " + token } } }
  const description = uuidv4();
  const password = uuidv4();

  const userServiceMock: MockType<UserService> = {
    findOneById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    updateUserWithProfieImg: jest.fn(),
    findAll: jest.fn(),
  };
  const jwtServiceMock: MockType<JwtService> = {
    decode: jest.fn(),
  };
  const commentServiceMock: MockType<CommentService> = {
    findByUserId: jest.fn(),
  };
  const tripServiceMock: MockType<TripService> = {
    findByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: userServiceMock
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock
        },
        {
          provide: CommentService,
          useValue: commentServiceMock
        },
        {
          provide: TripService,
          useValue: tripServiceMock
        },
      ],
    }).compile();
    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('user', () => {
    it('should return what userService.findOneById returns', async () => {
      const user = { _id: userId, username: username, description: description }
      const returnUser = Promise.resolve(user);
      userServiceMock.findOneById.mockReturnValue(returnUser)

      jwtServiceMock.decode.mockReturnValue({id: userId})

      expect(
        await resolver.user(context)
      ).toEqual(
        user
      );
    });
  });

  describe('createUser', () => {
    it('should return what userService.createUser returns', async () => {
      const userDto = {username: username, password: password, description: description}

      const user = { _id: userId, username: username, description: description }
      const returnUser = Promise.resolve(user);
      userServiceMock.createUser.mockReturnValue(returnUser)

      expect(
        await resolver.createUser(userDto)
      ).toEqual(
        user
      );
    });
  });

  describe('updateUser', () => {
    it('should return what userService.updateUser returns', async () => {
      const updatedUserDto = {username: username, password: password, description: description}

      const user = { _id: userId, username: username, description: description }
      const returnUser = Promise.resolve(user);
      userServiceMock.updateUser.mockReturnValue(returnUser)

      expect(
        await resolver.updateUser(updatedUserDto, context)
      ).toEqual(
        user
      );
    });
  });

  describe('updateUserWithProfieImg', () => {
    it('should return what userService.updateUserWithProfieImg returns', async () => {
      const file = {filename: uuidv4(), createReadStream: uuidv4()}

      const user = { _id: userId, username: username, description: description }
      const returnUser = Promise.resolve(user);
      userServiceMock.updateUserWithProfieImg.mockReturnValue(returnUser)

      expect(
        await resolver.updateUserWithProfieImg(file, context)
      ).toEqual(
        user
      );
    });
  });

  // FIELD RESOLVERS

  describe('comment', () => {
    it('should return what commentService.findByUserId returns', async () => {
      const mockCommentArray = [{_id: uuidv4()}]
      commentServiceMock.findByUserId.mockReturnValue(mockCommentArray)

      expect(
        await resolver.comment({_id: userId} as User)
      ).toEqual(
        mockCommentArray
      );
    });
  });

  describe('trip', () => {
    it('should return what tripService.findByUserId returns', async () => {
      const mockTripArray = [{_id: uuidv4()}]
      tripServiceMock.findByUserId.mockReturnValue(mockTripArray)

      expect(
        await resolver.trip({_id: userId} as User)
      ).toEqual(
        mockTripArray
      );
    });
  });

  describe('profileImg', () => {
    it('should return empty string when no profileImgUrl', () => {
      expect(
        resolver.profileImg({_id: userId} as User)
      ).toEqual(
        ""
      );
    });
  });

  describe('profileImg', () => {
    it('should return non empty string when profileImgUrl exists', () => {
      const returnString = uuidv4();
      fs.readFileSync.mockReturnValue(returnString);

      expect(
        resolver.profileImg({_id: userId, profileImgUrl: "exists"} as User)
      ).toEqual(
        returnString
      );
    });
  });
});
