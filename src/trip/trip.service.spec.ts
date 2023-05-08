import { Test, TestingModule } from '@nestjs/testing';
import { TripService } from './trip.service';
import { Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateTripDto, UpdatedTripDto } from './trip.dto';
type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('TripService', () => {
  let service: TripService;
  let tripRepositoryMock: MockType<Repository<Trip>> = {
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    findOneByOrFail: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };
  const userServiceMock: MockType<UserService> = {
    findOneById: jest.fn(),
    findUsersByIds: jest.fn(),
  };
  const mockTrip = {_id: uuidv4()};
  const mockUser = {_id: uuidv4()};
  const mockComment = {_id: uuidv4()};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripService,
        {
          provide: getRepositoryToken(Trip),
          useValue: tripRepositoryMock
        },
        {
          provide: UserService,
          useValue: userServiceMock
        },
      ],
    }).compile();
    jest.resetAllMocks();
    service = module.get<TripService>(TripService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return what tripRepository.find returns', async () => {
      const mockTripArray = [mockUser, mockUser];
      tripRepositoryMock.find.mockReturnValue(mockTripArray);

      expect(
        await service.findAll()
      ).toEqual(
        mockTripArray
      );
    });
  });

  describe('findAll', () => {
    it('should throw HttpException when userRepository.find throws error', async () => {
      tripRepositoryMock.find.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.findAll())
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('findAll', () => {
    it('should return what tripRepository.find returns', async () => {
      const mockTripArray = [mockUser, mockUser];
      tripRepositoryMock.find.mockReturnValue(mockTripArray);

      expect(
        await service.findAll()
      ).toEqual(
        mockTripArray
      );
    });
  });

  describe('findAll', () => {
    it('should throw HttpException when userRepository.find throws error', async () => {
      tripRepositoryMock.find.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.findAll())
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('findOneById', () => {
    it('should return what tripRepository.findOneByOrFail returns', async () => {
      const mockTripArray = [mockUser, mockUser];
      tripRepositoryMock.findOneByOrFail.mockReturnValue(mockTripArray);

      expect(
        await service.findOneById(uuidv4())
      ).toEqual(
        mockTripArray
      );
    });
  });

  describe('findOneById', () => {
    it('should throw HttpException when userRepository.findOneByOrFail throws error', async () => {
      tripRepositoryMock.findOneByOrFail.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.findOneById(uuidv4()))
        .rejects.toEqual(new HttpException('Trip not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('findByUserId', () => {
    it('should return what tripRepository.find returns', async () => {
      const mockTripArray = [mockUser, mockUser];
      tripRepositoryMock.find.mockReturnValue(mockTripArray);

      expect(
        await service.findByUserId(uuidv4())
      ).toEqual(
        mockTripArray
      );
    });
  });

  describe('findByUserId', () => {
    it('should throw HttpException when userRepository.find throws error', async () => {
      tripRepositoryMock.find.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.findByUserId(uuidv4()))
        .rejects.toEqual(new HttpException('Trip not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('createTrip', () => {
    it('should throw HttpException when description is over 400 chars', async () => {
      const tripDto = {
        country: uuidv4(),
        numberOfTravelBuddies: 10,
        // UUIDv4 has length of 36 chars, so 12 of them combined has length > 400 chars
        description: uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4()
      };

      await expect(service.createTrip(tripDto as CreateTripDto, uuidv4()))
        .rejects.toEqual(new HttpException('Too long description', HttpStatus.BAD_REQUEST));
    });
  });

  describe('createTrip', () => {
    it('should throw HttpException when numberOfTravelBuddies is below 1', async () => {
      const tripDto = {
        country: uuidv4(),
        numberOfTravelBuddies: 0,
        description: uuidv4()
      };

      await expect(service.createTrip(tripDto as CreateTripDto, uuidv4()))
        .rejects.toEqual(new HttpException('Number of travel buddies must be at least 1', HttpStatus.BAD_REQUEST));
    });
  });
  
  describe('createTrip', () => {
    it('should throw HttpException when userService.findOneById throws', async () => {
      userServiceMock.findOneById.mockImplementation(() => {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      });
      const tripDto = {
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4()
      };

      await expect(service.createTrip(tripDto as CreateTripDto, uuidv4()))
        .rejects.toEqual(new HttpException('User not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('createTrip', () => {
    it('should throw HttpException when tripRepository.save throws error', async () => {
      userServiceMock.findOneById.mockReturnValue(mockUser);
      tripRepositoryMock.save.mockImplementation(() => {
        throw new Error(uuidv4())
      });
      const tripDto = {
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4()
      };

      await expect(service.createTrip(tripDto as CreateTripDto, uuidv4()))
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('createTrip', () => {
    it('should return what tripRepository.save returns', async () => {
      userServiceMock.findOneById.mockReturnValue(mockUser);
      tripRepositoryMock.save.mockReturnValue(mockTrip);
      const tripDto = {
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4()
      };

      expect(
        await service.createTrip(tripDto as CreateTripDto, uuidv4())
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('updateTrip', () => {
    it('should return what tripRepository.findOneByOrFail returns', async () => {
      tripRepositoryMock.findOneByOrFail.mockReturnValue(mockTrip);
      const tripDto = {
        _id: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true
      };

      expect(
        await service.updateTrip(tripDto as UpdatedTripDto, uuidv4())
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('updateTrip', () => {
    it('should throw HttpException when tripRepository.update throws error', async () => {
      userServiceMock.findOneById.mockReturnValue(mockUser);
      tripRepositoryMock.update.mockImplementation(() => {
        throw new Error(uuidv4());
      });
      const tripDto = {
        _id: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true
      };

      await expect(service.updateTrip(tripDto as UpdatedTripDto, uuidv4()))
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('updateTrip', () => {
    it('should throw HttpException when description is over 400 chars', async () => {
      const tripDto = {
        _id: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        openForMoreTravelBuddies: true,
        // UUIDv4 has length of 36 chars, so 12 of them combined has length > 400 chars
        description: uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4() + uuidv4()
      };

      await expect(service.updateTrip(tripDto as UpdatedTripDto, uuidv4()))
        .rejects.toEqual(new HttpException('Too long description', HttpStatus.BAD_REQUEST));
    });
  });

  describe('updateTrip', () => {
    it('should throw HttpException when tripRepository.findOneByOrFail throws error', async () => {
      tripRepositoryMock.findOneByOrFail.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      const tripDto = {
        _id: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true
      };

      await expect(service.updateTrip(tripDto as UpdatedTripDto, uuidv4()))
        .rejects.toEqual(new HttpException('Trip not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('addPossibleTravelBuddy', () => {
    it('should throw HttpException when openForMoreTravelBuddies is false', async () => {
      const trip = {
        _id: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: false
      };
      tripRepositoryMock.findOneByOrFail.mockReturnValue(trip);

      await expect(service.addPossibleTravelBuddy(uuidv4(), uuidv4()))
        .rejects.toEqual(new HttpException('Trip is no longer open for more travel buddies.', HttpStatus.BAD_REQUEST));
    });
  });

  describe('addPossibleTravelBuddy', () => {
    it('should throw HttpException when userId is the owner of the trip', async () => {
      const userId = uuidv4();
      const trip = {
        userId: userId,
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true
      };
      tripRepositoryMock.findOneByOrFail.mockReturnValue(trip);

      await expect(service.addPossibleTravelBuddy(uuidv4(), userId))
        .rejects.toEqual(new HttpException('You are the owner of this trip and cannot be added as a possible travel buddy.', HttpStatus.FORBIDDEN));
    });
  });

  describe('addPossibleTravelBuddy', () => {
    it('should return trip if user is already possible travel buddy', async () => {
      const userId = uuidv4();
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [userId],
      };
      tripRepositoryMock.findOneByOrFail.mockReturnValue(trip);
      tripRepositoryMock.save.mockReturnValue(mockTrip);

      expect(
        await service.addPossibleTravelBuddy(uuidv4(), userId)
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('addPossibleTravelBuddy', () => {
    it('should return trip if user is already travel buddy', async () => {
      const userId = uuidv4();
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [],
        travelBuddiesIds: [userId],
      };
      tripRepositoryMock.findOneByOrFail.mockReturnValue(trip);
      tripRepositoryMock.save.mockReturnValue(mockTrip);

      expect(
        await service.addPossibleTravelBuddy(uuidv4(), userId)
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('addPossibleTravelBuddy', () => {
    it('should return what tripRepository.save returns', async () => {
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [],
        travelBuddiesIds: [],
      };
      tripRepositoryMock.findOneByOrFail.mockReturnValue(trip);
      tripRepositoryMock.save.mockReturnValue(mockTrip);

      expect(
        await service.addPossibleTravelBuddy(uuidv4(), uuidv4())
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('addPossibleTravelBuddy', () => {
    it('should throw HttpException if tripRepository.save throws error', async () => {
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [],
        travelBuddiesIds: [],
      };
      tripRepositoryMock.findOneByOrFail.mockReturnValue(trip);
      tripRepositoryMock.save.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.addPossibleTravelBuddy(uuidv4(), uuidv4()))
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('removePossibleTravelBuddy', () => {
    it('should return what tripRepository.save returns', async () => {
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [],
        travelBuddiesIds: [],
      };
      tripRepositoryMock.save.mockReturnValue(mockTrip);

      expect(
        await service.removePossibleTravelBuddy(trip as unknown as Trip, uuidv4())
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('removePossibleTravelBuddy', () => {
    it('should throw HttpException if tripRepository.save throws error', async () => {
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [],
        travelBuddiesIds: [],
      };
      tripRepositoryMock.save.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.removePossibleTravelBuddy(trip as unknown as Trip, uuidv4()))
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('promotePossibleTravelBuddy', () => {
    it('should return what tripRepository.save returns', async () => {
      const userId = uuidv4();
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [userId],
        travelBuddiesIds: [],
      };
      tripRepositoryMock.save.mockReturnValue(mockTrip);

      expect(
        await service.promotePossibleTravelBuddy(trip as unknown as Trip, userId)
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('promotePossibleTravelBuddy', () => {
    it('should throw HttpException if user is not already a possible travel buddy', async () => {
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [],
        travelBuddiesIds: [],
      };

      await expect(service.promotePossibleTravelBuddy(trip as unknown as Trip, uuidv4()))
        .rejects.toEqual(new HttpException('Possible travel buddy not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('promotePossibleTravelBuddy', () => {
    it('should throw HttpException if tripRepository.save throws error', async () => {
      const userId = uuidv4();
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [userId],
        travelBuddiesIds: [],
      };
      tripRepositoryMock.save.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.promotePossibleTravelBuddy(trip as unknown as Trip, userId))
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('demoteTravelBuddy', () => {
    it('should return what tripRepository.save returns', async () => {
      const userId = uuidv4();
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [],
        travelBuddiesIds: [userId],
      };
      tripRepositoryMock.save.mockReturnValue(mockTrip);

      expect(
        await service.demoteTravelBuddy(trip as unknown as Trip, userId)
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('demoteTravelBuddy', () => {
    it('should throw HttpException if user is not already a travel buddy', async () => {
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [],
        travelBuddiesIds: [],
      };

      await expect(service.demoteTravelBuddy(trip as unknown as Trip, uuidv4()))
        .rejects.toEqual(new HttpException('Travel buddy not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('demoteTravelBuddy', () => {
    it('should throw HttpException if tripRepository.save throws error', async () => {
      const userId = uuidv4();
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [],
        travelBuddiesIds: [userId],
      };
      tripRepositoryMock.save.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.demoteTravelBuddy(trip as unknown as Trip, userId))
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });


  describe('removeTravelBuddy', () => {
    it('should return what tripRepository.save returns', async () => {
      const userId = uuidv4();
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [],
        travelBuddiesIds: [userId],
      };
      tripRepositoryMock.save.mockReturnValue(mockTrip);

      expect(
        await service.removeTravelBuddy(trip as unknown as Trip, userId)
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('removeTravelBuddy', () => {
    it('should throw HttpException if user is not already a travel buddy', async () => {
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [],
        travelBuddiesIds: [],
      };

      await expect(service.removeTravelBuddy(trip as unknown as Trip, uuidv4()))
        .rejects.toEqual(new HttpException('Travel buddy not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('removeTravelBuddy', () => {
    it('should throw HttpException if tripRepository.save throws error', async () => {
      const userId = uuidv4();
      const trip = {
        userId: uuidv4(),
        country: uuidv4(),
        numberOfTravelBuddies: 1,
        description: uuidv4(),
        openForMoreTravelBuddies: true,
        possibleTravelBuddiesIds: [],
        travelBuddiesIds: [userId],
      };
      tripRepositoryMock.save.mockImplementation(() => {
        throw new Error(uuidv4());
      });

      await expect(service.removeTravelBuddy(trip as unknown as Trip, userId))
        .rejects.toEqual(new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });
});
