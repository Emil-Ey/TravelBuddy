import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateTripDto } from './trip.dto';
import { Trip } from './trip.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TripService {
  constructor(
    private userService: UserService, 
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>
  ) {}

  async findAll(): Promise<Trip[]> {
    try {
      return await this.tripRepository.find();
    } catch (err: any) {
      Logger.log(err, "findAll trips");
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneById(id: string): Promise<Trip> {
    try {
      return await this.tripRepository.findOneByOrFail({ _id: id });
    } catch (err: any) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async createTrip(createTripDto: CreateTripDto, userId: string): Promise<Trip> {
    const trip = new Trip();

    // Verify valid input.
    if(createTripDto.description.length > 400) {
      throw new HttpException('Too long description', HttpStatus.BAD_REQUEST);
    }
    if(createTripDto.numberOfTravelBuddies < 1) {
      throw new HttpException('Number of travel buddies must be at least 1', HttpStatus.BAD_REQUEST);
    }

    try {
      trip._id = uuidv4();
      const user = await this.userService.findOneById(userId)
      trip.user = user;
      trip.userId = user._id;
      trip.comments = [];
      trip.country = createTripDto.country;
      trip.description = createTripDto.description;
      trip.numberOfTravelBuddies = createTripDto.numberOfTravelBuddies;
      trip.possibleTravelBuddies = [];
      trip.travelBuddies = [];
      trip.openForMoreTravelBuddies = true;
      const newTrip = await this.tripRepository.save(trip);
      Logger.log(Object.keys(newTrip), "newTrip");
      return newTrip;
    } catch (err: any) {
      if(err instanceof HttpException) throw err
      Logger.log(err, "create trip")
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async clearDatabase(): Promise<Boolean> {
    this.tripRepository.clear();
    return true
  }
}