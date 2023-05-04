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
      trip.travelBuddiesIds = [];
      trip.openForMoreTravelBuddies = true;
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

  async addPossibleTravelBuddy(tripId: string, userId: string): Promise<Trip> {
    // Get trip
    const trip = await this.findOneById(tripId);

    // Check if trip is "openForMoreTravelBuddies"
    if(!trip.openForMoreTravelBuddies) {
      throw new HttpException('Trip is no longer open for more travel buddies.', HttpStatus.BAD_REQUEST);
    }

    // Check if user is the "owner" of the trip
    if(trip.userId == userId) throw new HttpException('You are the owner of this trip and cannot be added as a possible travel buddy.', HttpStatus.FORBIDDEN);
    // Check if user is already in list of possible travel buddies
    if(trip.possibleTravelBuddiesIds.includes(userId)) return this.tripRepository.save(trip);

    // deep copy possibleTravelBuddiesIds
    let possibleTravelBuddiesIdsCopy = JSON.parse(JSON.stringify(!trip.possibleTravelBuddiesIds ? [] : trip.possibleTravelBuddiesIds)); 
    
    // Create new object with appended arrays
    let newObj = { 'possibleTravelBuddiesIds': [...possibleTravelBuddiesIdsCopy, userId] }

    // Return the saved trip
    return this.tripRepository.save({...trip, ...newObj});
  }

  async removePossibleTravelBuddy(trip: Trip, userId: string): Promise<Trip> {

    // deep copy possibleTravelBuddiesIds
    let possibleTravelBuddiesIdsCopy = JSON.parse(JSON.stringify(!trip.possibleTravelBuddiesIds ? [] : trip.possibleTravelBuddiesIds)); 
    possibleTravelBuddiesIdsCopy = possibleTravelBuddiesIdsCopy.filter((buddyId: string) => buddyId != userId);

    // Create new object with appended arrays
    let newObj = { 'possibleTravelBuddiesIds': [...possibleTravelBuddiesIdsCopy] }

    // Return the saved trip
    return this.tripRepository.save({...trip, ...newObj});
  }

  async promotePossibleTravelBuddy(trip: Trip, userId: string): Promise<Trip> {

    // deep copy possibleTravelBuddiesIds
    let possibleTravelBuddiesIdsCopy = JSON.parse(JSON.stringify(!trip.possibleTravelBuddiesIds ? [] : trip.possibleTravelBuddiesIds)); 
    // deep copy travelbuddiesIds
    let travelBuddiesIdsCopy = JSON.parse(JSON.stringify(!trip.travelBuddiesIds ? [] : trip.travelBuddiesIds)); 

    // Check user is already a possible travel buddy
    if(!possibleTravelBuddiesIdsCopy.includes(userId)) {
      throw new HttpException('Possible travel buddy not found', HttpStatus.NOT_FOUND);
    }
    // Remove user from possible travel buddy
    possibleTravelBuddiesIdsCopy = possibleTravelBuddiesIdsCopy.filter((buddyId: string) => buddyId != userId);

    // Create new object with appended travelBuddiesIds array
    let newObj = { 'possibleTravelBuddiesIds': [...possibleTravelBuddiesIdsCopy], 'travelBuddiesIds': [...travelBuddiesIdsCopy, userId] }

    // Return the saved trip
    return this.tripRepository.save({...trip, ...newObj});
  }

  async demoteTravelBuddy(trip: Trip, userId: string): Promise<Trip> {

    // deep copy possibleTravelBuddiesIds
    let possibleTravelBuddiesIdsCopy = JSON.parse(JSON.stringify(!trip.possibleTravelBuddiesIds ? [] : trip.possibleTravelBuddiesIds)); 
    // deep copy travelbuddiesIds
    let travelBuddiesIdsCopy = JSON.parse(JSON.stringify(!trip.travelBuddiesIds ? [] : trip.travelBuddiesIds)); 

    // Check user is already a travel buddy
    if(!travelBuddiesIdsCopy.includes(userId)) {
      throw new HttpException('Travel buddy not found', HttpStatus.NOT_FOUND);
    }
    // Remove user from possible travel buddy
    travelBuddiesIdsCopy = travelBuddiesIdsCopy.filter((buddyId: string) => buddyId != userId);

    // Create new object with appended travelBuddiesIds array
    let newObj = { 'possibleTravelBuddiesIds': [...possibleTravelBuddiesIdsCopy, userId], 'travelBuddiesIds': [...travelBuddiesIdsCopy] }

    // Return the saved trip
    return this.tripRepository.save({...trip, ...newObj});
  }

  async removeTravelBuddy(trip: Trip, userId: string): Promise<Trip> {
    // deep copy travelbuddiesIds
    let travelBuddiesIdsCopy = JSON.parse(JSON.stringify(!trip.travelBuddiesIds ? [] : trip.travelBuddiesIds)); 

    // Check user is already a travel buddy
    if(!travelBuddiesIdsCopy.includes(userId)) {
      throw new HttpException('Travel buddy not found', HttpStatus.NOT_FOUND);
    }
    // Remove user from possible travel buddy
    travelBuddiesIdsCopy = travelBuddiesIdsCopy.filter((buddyId: string) => buddyId != userId);

    // Create new object with appended travelBuddiesIds array
    let newObj = { 'travelBuddiesIds': [...travelBuddiesIdsCopy] }

    // Return the saved trip
    return this.tripRepository.save({...trip, ...newObj});
  }

  // REMOVE IN PROD
  async clearDatabase(): Promise<Boolean> {
    await this.tripRepository.query('DELETE FROM "trip"');
    return true
  }
}