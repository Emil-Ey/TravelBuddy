import { Test, TestingModule } from '@nestjs/testing';
import { TripResolver } from './trip.resolver';
import { TripService } from './trip.service';
import { UserService } from 'src/user/user.service';
import { CommentService } from 'src/comment/comment.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { Trip } from './trip.entity';
import { CreateTripDto, TravelBuddyDto, UpdatedTripDto } from './trip.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('TripResolver', () => {
  let resolver: TripResolver;
  const tripServiceMock: MockType<TripService> = {
    findAll: jest.fn(),
    findOneById: jest.fn(),
    createTrip: jest.fn(),
    updateTrip: jest.fn(),
    addPossibleTravelBuddy: jest.fn(),
    removePossibleTravelBuddy: jest.fn(),
    promotePossibleTravelBuddy: jest.fn(),
    demoteTravelBuddy: jest.fn(),
    removeTravelBuddy: jest.fn(),
  };
  const userServiceMock: MockType<UserService> = {
    findOneById: jest.fn(),
    findUsersByIds: jest.fn(),
  };
  const commentServiceMock: MockType<CommentService> = {
    findByTripId: jest.fn(),
  };
  const jwtServiceMock: MockType<JwtService> = {
    decode: jest.fn(),
  };
  const userId = uuidv4();
  const mockTrip = { _id: uuidv4(), userId: userId };
  const mockUser = { _id: uuidv4() };
  const mockComment = { _id: uuidv4() };
  const token = uuidv4();
  const context = { req: { headers: { authorization: "Bearer " + token } } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripResolver,
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

    resolver = module.get<TripResolver>(TripResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('trips', () => {
    it('should return what tripService.findAll returns', async () => {
      tripServiceMock.findAll.mockReturnValue([mockTrip, mockTrip])

      expect(
        await resolver.trips()
      ).toEqual(
        [mockTrip, mockTrip]
      );
    });
  });

  describe('trip', () => {
    it('should return what tripService.findOneById returns', async () => {
      tripServiceMock.findOneById.mockReturnValue(mockTrip)

      expect(
        await resolver.trip(mockTrip._id)
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('createTrip', () => {
    it('should return what tripService.createTrip returns', async () => {
      tripServiceMock.createTrip.mockReturnValue(mockTrip)
      jwtServiceMock.decode.mockReturnValue({id: userId})

      expect(
        await resolver.createTrip({} as CreateTripDto, context)
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('updateTrip', () => {
    it('should return what tripService.updateTrip returns', async () => {
      tripServiceMock.updateTrip.mockReturnValue(mockTrip)
      jwtServiceMock.decode.mockReturnValue({id: userId})

      expect(
        await resolver.updateTrip({} as UpdatedTripDto, context)
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('addPossibleTravelBuddy', () => {
    it('should return what tripService.addPossibleTravelBuddy returns', async () => {
      tripServiceMock.addPossibleTravelBuddy.mockReturnValue(mockTrip)
      jwtServiceMock.decode.mockReturnValue({id: userId})

      expect(
        await resolver.addPossibleTravelBuddy(uuidv4(), context)
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('removePossibleTravelBuddy', () => {
    it('should return what tripService.removePossibleTravelBuddy returns', async () => {
      tripServiceMock.findOneById.mockReturnValue(mockTrip);
      jwtServiceMock.decode.mockReturnValue({id: userId});
      tripServiceMock.removePossibleTravelBuddy.mockReturnValue(mockTrip);

      expect(
        await resolver.removePossibleTravelBuddy({} as TravelBuddyDto, context)
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('removePossibleTravelBuddy', () => {
    it('should return what tripService.removePossibleTravelBuddy returns', async () => {
      tripServiceMock.findOneById.mockReturnValue(mockTrip);
      jwtServiceMock.decode.mockReturnValue({id: userId});
      tripServiceMock.removePossibleTravelBuddy.mockReturnValue(mockTrip);

      expect(
        await resolver.removePossibleTravelBuddy({userId: userId} as TravelBuddyDto, context)
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('removePossibleTravelBuddy', () => {
    it('should throw HttpException if ids dont match', async () => {
      tripServiceMock.findOneById.mockReturnValue(mockTrip);
      jwtServiceMock.decode.mockReturnValue({id: uuidv4()});
      tripServiceMock.removePossibleTravelBuddy.mockReturnValue(mockTrip);

      await expect(resolver.removePossibleTravelBuddy({} as TravelBuddyDto, context))
        .rejects.toEqual(new HttpException('You are not the owner of this trip, and cannot remove another user as a possible travel buddy', HttpStatus.FORBIDDEN));
    });
  });

  describe('promotePossibleTravelBuddy', () => {
    it('should throw HttpException if tripService.findOneById throws exception', async () => {
      jwtServiceMock.decode.mockReturnValue({id: uuidv4()});
      tripServiceMock.findOneById.mockImplementation(() => {
        throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
      });

      await expect(resolver.promotePossibleTravelBuddy({} as TravelBuddyDto, context))
        .rejects.toEqual(new HttpException('Trip not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('promotePossibleTravelBuddy', () => {
    it('should return what tripService.promotePossibleTravelBuddy returns', async () => {
      tripServiceMock.findOneById.mockReturnValue(mockTrip);
      jwtServiceMock.decode.mockReturnValue({id: userId});
      tripServiceMock.promotePossibleTravelBuddy.mockReturnValue(mockTrip);

      expect(
        await resolver.promotePossibleTravelBuddy({userId: userId} as TravelBuddyDto, context)
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('promotePossibleTravelBuddy', () => {
    it('should throw HttpException if ids dont match', async () => {
      tripServiceMock.findOneById.mockReturnValue(mockTrip);
      jwtServiceMock.decode.mockReturnValue({id: uuidv4()});
      tripServiceMock.promotePossibleTravelBuddy.mockReturnValue(mockTrip);

      await expect(resolver.promotePossibleTravelBuddy({} as TravelBuddyDto, context))
        .rejects.toEqual(new HttpException('You are not the owner of this trip, and cannot promote a possible travel buddy', HttpStatus.FORBIDDEN));
    });
  });
  
  describe('demoteTravelBuddy', () => {
    it('should throw HttpException if tripService.findOneById throws exception', async () => {
      jwtServiceMock.decode.mockReturnValue({id: uuidv4()});
      tripServiceMock.findOneById.mockImplementation(() => {
        throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
      });

      await expect(resolver.demoteTravelBuddy({} as TravelBuddyDto, context))
        .rejects.toEqual(new HttpException('Trip not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('demoteTravelBuddy', () => {
    it('should return what tripService.promotePossibleTravelBuddy returns', async () => {
      tripServiceMock.findOneById.mockReturnValue(mockTrip);
      jwtServiceMock.decode.mockReturnValue({id: userId});
      tripServiceMock.demoteTravelBuddy.mockReturnValue(mockTrip);

      expect(
        await resolver.demoteTravelBuddy({userId: userId} as TravelBuddyDto, context)
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('demoteTravelBuddy', () => {
    it('should throw HttpException if ids dont match', async () => {
      tripServiceMock.findOneById.mockReturnValue(mockTrip);
      jwtServiceMock.decode.mockReturnValue({id: uuidv4()});
      tripServiceMock.demoteTravelBuddy.mockReturnValue(mockTrip);

      await expect(resolver.demoteTravelBuddy({} as TravelBuddyDto, context))
        .rejects.toEqual(new HttpException('You are not the owner of this trip, and cannot demote a travel buddy', HttpStatus.FORBIDDEN));
    });
  });

  describe('removeTravelBuddy', () => {
    it('should throw HttpException if tripService.findOneById throws exception', async () => {
      jwtServiceMock.decode.mockReturnValue({id: uuidv4()});
      tripServiceMock.findOneById.mockImplementation(() => {
        throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
      });

      await expect(resolver.removeTravelBuddy({} as TravelBuddyDto, context))
        .rejects.toEqual(new HttpException('Trip not found', HttpStatus.NOT_FOUND));
    });
  });

  describe('removeTravelBuddy', () => {
    it('should return what tripService.promotePossibleTravelBuddy returns', async () => {
      tripServiceMock.findOneById.mockReturnValue(mockTrip);
      jwtServiceMock.decode.mockReturnValue({id: userId});
      tripServiceMock.removeTravelBuddy.mockReturnValue(mockTrip);

      expect(
        await resolver.removeTravelBuddy({userId: userId} as TravelBuddyDto, context)
      ).toEqual(
        mockTrip
      );
    });
  });

  describe('removeTravelBuddy', () => {
    it('should throw HttpException if ids dont match', async () => {
      tripServiceMock.findOneById.mockReturnValue(mockTrip);
      jwtServiceMock.decode.mockReturnValue({id: uuidv4()});
      tripServiceMock.removeTravelBuddy.mockReturnValue(mockTrip);

      await expect(resolver.removeTravelBuddy({} as TravelBuddyDto, context))
        .rejects.toEqual(new HttpException('You are not the owner of this trip, and cannot remove a travel buddy', HttpStatus.FORBIDDEN));
    });
  });
  

  // FIELD RESOLVERS

  describe('user', () => {
    it('should return what userService.findOneById returns', async () => {
      userServiceMock.findOneById.mockReturnValue(mockUser)

      expect(
        await resolver.user({_id: uuidv4(), userId: uuidv4()} as Trip)
      ).toEqual(
        mockUser
      );
    });
  });

  describe('possibleTravelBuddies', () => {
    it('should return what userService.findUsersByIds returns', async () => {
      userServiceMock.findUsersByIds.mockReturnValue([mockUser, mockUser])

      expect(
        await resolver.possibleTravelBuddy({_id: uuidv4(), possibleTravelBuddiesIds: [uuidv4(), uuidv4()]} as Trip)
      ).toEqual(
        [mockUser, mockUser]
      );
    });
  });

  describe('travelBuddies', () => {
    it('should return what userService.findUsersByIds returns', async () => {
      userServiceMock.findUsersByIds.mockReturnValue([mockUser, mockUser])

      expect(
        await resolver.travelBuddy({_id: uuidv4(), travelBuddiesIds: [uuidv4(), uuidv4()]} as Trip)
      ).toEqual(
        [mockUser, mockUser]
      );
    });
  });

  describe('comments', () => {
    it('should return what commentService.findByTripId returns', async () => {
      commentServiceMock.findByTripId.mockReturnValue([mockComment, mockComment])

      expect(
        await resolver.comment({_id: uuidv4()} as Trip)
      ).toEqual(
        [mockComment, mockComment]
      );
    });
  });
});
