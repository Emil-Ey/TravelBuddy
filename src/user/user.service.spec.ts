import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';
import { UserService } from './user.service';
const argon2 = require('argon2');
jest.mock('argon2');
const fs = require('fs');
jest.mock('fs')
type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('UserService', () => {
  let service: UserService;
  let userRepositoryMock: MockType<Repository<User>> = {
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    findOneByOrFail: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };
  const mockUser = {_id: uuidv4()};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock
        },
      ],
    }).compile();
    jest.clearAllMocks();
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return what userRepository.find returns', async () => {
      const mockUserArray = [mockUser, mockUser];
      userRepositoryMock.find.mockReturnValue(mockUserArray);

      expect(
        await service.findAll()
      ).toEqual(
        mockUserArray
      );
    });
  });

  describe('findAll', () => {
    it('should throw HttpException when userRepository.find throws error', async () => {
      userRepositoryMock.find.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.findAll())
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('findUsersByIds', () => {
    it('should return empty array when given empty array of ids', async () => {
      expect(
        await service.findUsersByIds([])
      ).toEqual(
        []
      );
    });
  });

  describe('findUsersByIds', () => {
    it('should return list of users', async () => {
      const mockUserArray = [mockUser, mockUser]
      const createQueryBuilder: any = {
        where: () => createQueryBuilder,
        getMany: () => mockUserArray,
      };
      userRepositoryMock.createQueryBuilder.mockReturnValue(createQueryBuilder);

      expect(
        await service.findUsersByIds([uuidv4(), uuidv4()])
      ).toEqual(
        mockUserArray
      );
    });
  });

  describe('findUsersByIds', () => {
    it('should throw HttpException if userRepository.createQueryBuilder fails', async () => {
      userRepositoryMock.createQueryBuilder.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.findUsersByIds([uuidv4(), uuidv4()]))
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('findOneById', () => {
    it('should return what userRepository.findOneByOrFail returns', async () => {
      userRepositoryMock.findOneByOrFail.mockReturnValue(mockUser);

      expect(
        await service.findOneById(uuidv4())
      ).toEqual(
        mockUser
      );
    });
  });
  
  describe('findOneById', () => {
    it('should throw HttpException if userRepository.findOneByOrFail fails', async () => {
      userRepositoryMock.findOneByOrFail.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.findOneById(uuidv4()))
        .rejects.toEqual(new HttpException('User not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('findOneByUsername', () => {
    it('should return what userRepository.findOneByOrFail returns', async () => {
      userRepositoryMock.findOneByOrFail.mockReturnValue(mockUser);

      expect(
        await service.findOneByUsername(uuidv4())
      ).toEqual(
        mockUser
      );
    });
  });
  
  describe('findOneByUsername', () => {
    it('should throw HttpException if userRepository.findOneByOrFail fails', async () => {
      userRepositoryMock.findOneByOrFail.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.findOneByUsername(uuidv4()))
        .rejects.toEqual(new HttpException('User not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('createUser', () => {
    it('should throw HttpException when too long description', async () => {
      const userDto = {
        username: uuidv4(),
        password: uuidv4(),
        // UUIDv4 has length of 36 chars, so 6 of them combined has length > 200 chars
        description: uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4()
      }

      await expect(service.createUser(userDto))
        .rejects.toEqual(new HttpException('Too long description. Max 200 characters.', HttpStatus.BAD_REQUEST));
    });
  });

  describe('createUser', () => {
    it('should return what userRepository.save returns', async () => {
      const userDto = {
        username: uuidv4(),
        password: uuidv4(),
        description: uuidv4() 
      }
      userRepositoryMock.save.mockReturnValue(mockUser);

      expect(
        await service.createUser(userDto)
      ).toEqual(
        mockUser
      );
    });
  });

  describe('createUser', () => {
    it('should throw HttpException if userRepository.save fails', async () => {
      const userDto = {
        username: uuidv4(),
        password: uuidv4(),
        description: uuidv4() 
      }
      userRepositoryMock.save.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.createUser(userDto))
        .rejects.toEqual(new HttpException('Username taken.', HttpStatus.CONFLICT));
    });
  });

  describe('createUser', () => {
    it('should throw HttpException if argon2 fails', async () => {
      const userDto = {
        username: uuidv4(),
        password: uuidv4(),
        description: uuidv4() 
      };
      argon2.hash.mockImplementation(() => {
        throw new Error(uuidv4());
      });
      userRepositoryMock.save.mockReturnValue(mockUser);

      await expect(service.createUser(userDto))
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('updateUser', () => {
    it('should throw HttpException when too long description', async () => {
      const userDto = {
        username: uuidv4(),
        password: uuidv4(),
        // UUIDv4 has length of 36 chars, so 6 of them combined has length > 200 chars
        description: uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4()
      };

      await expect(service.updateUser(uuidv4(), userDto))
        .rejects.toEqual(new HttpException('Too long description. Max 200 characters.', HttpStatus.BAD_REQUEST));
    });
  });

  describe('updateUser', () => {
    it('should throw HttpException if argon2 fails hashing', async () => {
      const userDto = {
        username: uuidv4(),
        password: uuidv4(),
        description: uuidv4(),
      };
      argon2.hash.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.updateUser(uuidv4(), userDto))
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('updateUser', () => {
    it('should throw HttpException if userRepository.update fails', async () => {
      const userDto = {
        username: uuidv4(),
        password: uuidv4(),
        description: uuidv4(),
      };
      argon2.hash.mockReturnValue(uuidv4())
      userRepositoryMock.update.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.updateUser(uuidv4(), userDto))
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('updateUser', () => {
    it('should return what userRepository.findOneByOrFail returns', async () => {
      const userDto = {
        username: uuidv4(),
        password: uuidv4(),
        description: uuidv4(),
      };
      argon2.hash.mockReturnValue(uuidv4());
      userRepositoryMock.update.mockReturnValue(true);
      userRepositoryMock.findOneByOrFail.mockReturnValue(mockUser);

      expect(
        await service.updateUser(uuidv4(), userDto)
      ).toEqual(
        mockUser
      );
    });
  });

  describe('updateUserWithProfieImg', () => {
    it('should return what userRepository.save returns', async () => {
      const createReadStreamMock: any = {
        pipe: () => createReadStreamMock,
        on: () => createReadStreamMock,
      };
      const file = {
        filename: uuidv4(),
        createReadStream: () => createReadStreamMock
      }
      fs.createWriteStream.mockImplementation(() => true);
      userRepositoryMock.save.mockReturnValue(mockUser);

      expect(
        await service.updateUserWithProfieImg(file, uuidv4())
      ).toEqual(
        mockUser
      );
    });
  });

  describe('updateUserWithProfieImg', () => {
    it('should return what userRepository.save returns', async () => {
      const createReadStreamMock: any = {
        pipe: () => createReadStreamMock,
        on: () => createReadStreamMock,
      };
      const file = {
        filename: uuidv4(),
        createReadStream: () => createReadStreamMock
      }
      fs.createWriteStream.mockImplementation(() => true);
      userRepositoryMock.save.mockImplementation(() => {
        throw new Error(uuidv4())
      });

      await expect(service.updateUserWithProfieImg(file, uuidv4()))
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });
});
