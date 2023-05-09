import { Test, TestingModule } from '@nestjs/testing';
import { CommentResolver } from './comment.resolver';
import { v4 as uuidv4 } from 'uuid';
import { CommentService } from './comment.service';
import { UserService } from 'src/user/user.service';
import { TripService } from 'src/trip/trip.service';
import { JwtService } from '@nestjs/jwt';
import { Comment } from './comment.entity';
import { CreateCommentDto, UpdatedCommentDto } from './comment.dto';
type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('CommentResolver', () => {
  let resolver: CommentResolver;
  const commentServiceMock: MockType<CommentService> = {
    createComment: jest.fn(),
    updateComment: jest.fn(),
    removeComment: jest.fn(),
  };
  const userServiceMock: MockType<UserService> = {
    findOneById: jest.fn(),
  };
  const tripServiceMock: MockType<TripService> = {
    findOneById: jest.fn(),
  };
  const jwtServiceMock: MockType<JwtService> = {
    decode: jest.fn(),
  };
  const userId = uuidv4();
  const mockComment = { _id: uuidv4() };
  const token = uuidv4();
  const context = { req: { headers: { authorization: "Bearer " + token } } };
  const mockTrip = { _id: uuidv4() };
  const mockUser = { _id: uuidv4() };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentResolver,
        {
          provide: TripService,
          useValue: tripServiceMock
        },
        {
          provide: UserService,
          useValue: userServiceMock
        },
        {
          provide: CommentService,
          useValue: commentServiceMock
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock
        },
      ],
    }).compile();

    resolver = module.get<CommentResolver>(CommentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createComment', () => {
    it('should return what commentService.createComment returns', async () => {
      commentServiceMock.createComment.mockReturnValue(mockComment)
      jwtServiceMock.decode.mockReturnValue({id: userId})

      expect(
        await resolver.createComment({} as CreateCommentDto, context)
      ).toEqual(
        mockComment
      );
    });
  });

  describe('updateComment', () => {
    it('should return what commentService.updateComment returns', async () => {
      commentServiceMock.updateComment.mockReturnValue(mockComment)
      jwtServiceMock.decode.mockReturnValue({id: userId})

      expect(
        await resolver.updateComment({} as UpdatedCommentDto, context)
      ).toEqual(
        mockComment
      );
    });
  });

  describe('removeComment', () => {
    it('should return what commentService.removeComment returns', async () => {
      commentServiceMock.removeComment.mockReturnValue(true)
      jwtServiceMock.decode.mockReturnValue({id: userId})

      expect(
        await resolver.removeComment(uuidv4(), context)
      ).toEqual(
        true
      );
    });
  });

  // FIELD RESOLVERS

  describe('user', () => {
    it('should return what userService.findOneById returns', async () => {
      userServiceMock.findOneById.mockReturnValue(mockUser)

      expect(
        await resolver.user({_id: uuidv4(), userId: uuidv4()} as Comment)
      ).toEqual(
        mockUser
      );
    });
  });

  describe('trip', () => {
    it('should return what userService.findOneById returns', async () => {
      tripServiceMock.findOneById.mockReturnValue(mockTrip)

      expect(
        await resolver.trip({_id: uuidv4(), tripId: uuidv4()} as Comment)
      ).toEqual(
        mockTrip
      );
    });
  });
});
