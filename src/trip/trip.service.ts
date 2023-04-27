import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateTripDto, TravelBuddyDto, UpdatedTripDto } from './trip.dto';
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
      Logger.error(err, "findAll trips");
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneById(id: string): Promise<Trip> {
    try {
      return await this.tripRepository.findOneByOrFail({ _id: id });
    } catch (err: any) {
      throw new HttpException('Trip not found', HttpStatus.NOT_FOUND);
    }
  }

  async findByUserId(userId: string): Promise<Trip[]> {
    try {
      return await this.tripRepository.find({ where: {userId: userId}});
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
      trip.userId = user._id;
      trip.comments = [];
      trip.country = createTripDto.country;
      trip.description = createTripDto.description;
      trip.numberOfTravelBuddies = createTripDto.numberOfTravelBuddies;
      trip.possibleTravelBuddies = [];
      trip.possibleTravelBuddiesIds = [];
      trip.travelBuddies = [];
      trip.openForMoreTravelBuddies = true;
      console.log(trip);
      const newTrip = await this.tripRepository.save(trip);
      return newTrip;
    } catch (err: any) {
      if(err instanceof HttpException) throw err
      Logger.error(err, "create trip")
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTrip(updatedTripDto: UpdatedTripDto): Promise<Trip> {
    let id = updatedTripDto._id
    let newObj = {
      ...(updatedTripDto.country && { 'country': updatedTripDto.country}), 
      ...(updatedTripDto.description && { 'description': updatedTripDto.description}),
      ...(updatedTripDto.numberOfTravelBuddies && { 'numberOfTravelBuddies': updatedTripDto.numberOfTravelBuddies}),
      ...(updatedTripDto.openForMoreTravelBuddies != null && { 'openForMoreTravelBuddies': updatedTripDto.openForMoreTravelBuddies}),
    }

    try {
      await this.tripRepository.update({"_id": id}, newObj)
    } catch (err: any) {
      Logger.error(err, "updateTrip, updating database");
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Cannot return object when saving, so we must find it again and return it.
    return this.findOneById(id)
  }

  async addPossibleTravelBuddyDto(travelBuddyDto: TravelBuddyDto): Promise<Trip> {
    const trip = await this.findOneById(travelBuddyDto.tripId);
    const user = await this.userService.findOneById(travelBuddyDto.userId)
    if(trip.possibleTravelBuddiesIds.includes(user._id)) return this.tripRepository.save(trip);
    let possibleTravelBuddiesCopy = JSON.parse(JSON.stringify(!trip.possibleTravelBuddies ? [] : trip.possibleTravelBuddies)); 
    let possibleTravelBuddiesIdsCopy = JSON.parse(JSON.stringify(!trip.possibleTravelBuddiesIds ? [] : trip.possibleTravelBuddiesIds)); 
    let newObj = { 'possibleTravelBuddies': [...possibleTravelBuddiesCopy, user], 'possibleTravelBuddiesIds': [...possibleTravelBuddiesIdsCopy, user._id] }
    return this.tripRepository.save({...trip, ...newObj});
  }

  // REMOVE IN PROD
  async clearDatabase(): Promise<Boolean> {
    await this.tripRepository.query('DELETE FROM "trip"');
    return true
  }
}