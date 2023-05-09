import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateCommentDto, UpdatedCommentDto } from './comment.dto';
type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('CommentService', () => {
  let service: CommentService;
  let commentRepositoryMock: MockType<Repository<Comment>> = {
    find: jest.fn(),
    findOneByOrFail: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const mockComment = {_id: uuidv4(), userId: uuidv4()};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: commentRepositoryMock
        },
      ],
    }).compile();

    jest.resetAllMocks();
    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return what commentRepository.find returns', async () => {
      const mockCommentArray = [mockComment, mockComment];
      commentRepositoryMock.find.mockReturnValue(mockCommentArray);

      expect(
        await service.findAll()
      ).toEqual(
        mockCommentArray
      );
    });
  });

  describe('findAll', () => {
    it('should throw HttpException if commentRepository.find throws', async () => {
      commentRepositoryMock.find.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.findAll())
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('findOneById', () => {
    it('should return what commentRepository.findOneByOrFail returns', async () => {
      commentRepositoryMock.findOneByOrFail.mockReturnValue(mockComment);

      expect(
        await service.findOneById(uuidv4())
      ).toEqual(
        mockComment
      );
    });
  });

  describe('findOneById', () => {
    it('should throw HttpException if commentRepository.findOneByOrFail throws', async () => {
      commentRepositoryMock.findOneByOrFail.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.findOneById(uuidv4()))
        .rejects.toEqual(new HttpException('Comment not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('findByUserId', () => {
    it('should return what commentRepository.findOneByOrFail returns', async () => {
      const mockCommentArray = [mockComment, mockComment];
      commentRepositoryMock.find.mockReturnValue(mockCommentArray);

      expect(
        await service.findByUserId(uuidv4())
      ).toEqual(
        mockCommentArray
      );
    });
  });

  describe('findByUserId', () => {
    it('should throw HttpException if commentRepository.findOneByOrFail throws', async () => {
      commentRepositoryMock.find.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      expect(
        await service.findByUserId(uuidv4())
      ).toEqual(
        []
      );
    });
  });

  describe('findByTripId', () => {
    it('should return what commentRepository.findOneByOrFail returns', async () => {
      const mockCommentArray = [mockComment, mockComment];
      commentRepositoryMock.find.mockReturnValue(mockCommentArray);

      expect(
        await service.findByTripId(uuidv4())
      ).toEqual(
        mockCommentArray
      );
    });
  });

  describe('findByTripId', () => {
    it('should throw HttpException if commentRepository.findOneByOrFail throws', async () => {
      commentRepositoryMock.find.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      expect(
        await service.findByTripId(uuidv4())
      ).toEqual(
        []
      );
    });
  });

  describe('createComment', () => {
    it('should throw HttpException if commentDto.text over 200 chars', async () => {
      const commentDto = {
        tripId: uuidv4(),
        // UUIDv4 has length of 36 chars, so 6 of them combined has length > 200 chars
        text: uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4(),
      };

      await expect(service.createComment(commentDto as CreateCommentDto, uuidv4()))
        .rejects.toEqual(new HttpException('Too long comment. Max 200 characters.', HttpStatus.BAD_REQUEST));
    });
  });

  describe('createComment', () => {
    it('should throw HttpException if commentDto.text over 200 chars', async () => {
      commentRepositoryMock.save.mockImplementation(() => {
        throw new Error(uuidv4());
      });
      const commentDto = {
        tripId: uuidv4(),
        text: uuidv4(),
      };

      await expect(service.createComment(commentDto as CreateCommentDto, uuidv4()))
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('createComment', () => {
    it('should return what commentRepository.save returns', async () => {
      commentRepositoryMock.save.mockReturnValue(mockComment);
      const commentDto = {
        tripId: uuidv4(),
        text: uuidv4(),
      };

      expect(
        await service.createComment(commentDto as CreateCommentDto, uuidv4())
      ).toEqual(
        mockComment
      );
    });
  });

  describe('updateComment', () => {
    it('should throw HttpException if commentDto.text over 200 chars', async () => {
      const commentDto = {
        _id: uuidv4(),
        tripId: uuidv4(),
        // UUIDv4 has length of 36 chars, so 6 of them combined has length > 200 chars
        text: uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4(),
        userId: uuidv4(),
      };

      await expect(service.updateComment(commentDto as UpdatedCommentDto, uuidv4()))
        .rejects.toEqual(new HttpException('Too long comment. Max 200 characters.', HttpStatus.BAD_REQUEST));
    });
  });

  describe('updateComment', () => {
    it('should throw HttpException if found comment.userId does not match given user id', async () => {
      commentRepositoryMock.findOneByOrFail.mockReturnValue(mockComment);
      const commentDto = {
        _id: uuidv4(),
        tripId: uuidv4(),
        text: uuidv4(),
        userId: uuidv4(),
      };

      await expect(service.updateComment(commentDto as UpdatedCommentDto, uuidv4()))
        .rejects.toEqual(new HttpException('You are not the owner of this comment.', HttpStatus.FORBIDDEN));
    });
  });

  describe('updateComment', () => {
    it('should return what commentRepository.save returns', async () => {
      const userId = uuidv4();
      const commentDto = {
        _id: uuidv4(),
        tripId: uuidv4(),
        text: uuidv4(),
        userId: userId,
      };
      commentRepositoryMock.findOneByOrFail.mockReturnValue(commentDto);
      commentRepositoryMock.save.mockReturnValue(mockComment);

      expect(
        await service.updateComment(commentDto as UpdatedCommentDto, userId)
      ).toEqual(
        mockComment
      );
    });
  });

  describe('removeComment', () => {
    it('should throw HttpException if found comment.userId does not match given user id', async () => {
      const commentDto = {
        _id: uuidv4(),
        tripId: uuidv4(),
        text: uuidv4(),
        userId: uuidv4(),
      };
      commentRepositoryMock.findOneByOrFail.mockReturnValue(commentDto);

      await expect(service.removeComment(uuidv4(), uuidv4()))
        .rejects.toEqual(new HttpException('You are not the owner of this comment.', HttpStatus.FORBIDDEN));
    });
  });

  describe('removeComment', () => {
    it('should throw HttpException if found comment.userId does not match given user id', async () => {
      const userId = uuidv4();
      const commentDto = {
        _id: uuidv4(),
        tripId: uuidv4(),
        text: uuidv4(),
        userId: userId,
      };
      commentRepositoryMock.findOneByOrFail.mockReturnValue(commentDto);
      commentRepositoryMock.delete.mockImplementation(() => {
        throw new Error(uuidv4());
      })

      await expect(service.removeComment(uuidv4(), userId))
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('removeComment', () => {
    it('should return true', async () => {
      const userId = uuidv4();
      const commentDto = {
        _id: uuidv4(),
        tripId: uuidv4(),
        text: uuidv4(),
        userId: userId,
      };
      commentRepositoryMock.findOneByOrFail.mockReturnValue(commentDto);

      expect(
        await service.removeComment(uuidv4(), userId)
      ).toEqual(
        true
      );
    });
  });
});
