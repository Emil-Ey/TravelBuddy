import { HttpException, HttpStatus, Logger, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Comment } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateTripDto, TravelBuddyDto, UpdatedTripDto } from './trip.dto';
import { Trip } from './trip.entity';
import { TripService } from './trip.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Resolver(Trip)
export class TripResolver {
  constructor(
    private tripService: TripService, 
    private userService: UserService, 
    private commentService: CommentService, 
    private jwtService: JwtService,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>
  ) {}
  
  @ResolveField('user', () => User)
  user(@Root() trip: Trip) {
    return this.userService.findOneById(trip.userId);
  }

  @ResolveField('possibleTravelBuddies', () => [User])
  async possibleTravelBuddy(@Root() trip: Trip) {
    return this.userService.findUsersByIds(trip.possibleTravelBuddiesIds)
  }

  @ResolveField('travelBuddies', () => [User])
  travelBuddy(@Root() trip: Trip) {
    return this.userService.findUsersByIds(trip.travelBuddiesIds)
  }

  @ResolveField('comments', () => [Comment])
  comment(@Root() trip: Trip) {
    let comments = [];
    trip.comments?.forEach(async comment => {
        comments.push(await this.commentService.findOneById(comment._id))
    })
    return comments;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Trip])
  async trips() {
    return this.tripService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Trip)
  async trip(@Args('id') id: string) {
    return this.tripService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Trip)
  async createTrip(
    @Args('createTripDto') createTripDto: CreateTripDto,
    @Context() context: any
  ) {
    const jwt = context.req.headers.authorization.replace('Bearer ', '');
    const user = this.jwtService.decode(jwt, { json: true }) as { id: string };
    return this.tripService.createTrip(createTripDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Trip)
  async updateTrip(
    @Args('updatedTripDto') updatedTripDto: UpdatedTripDto
  ) {
    return this.tripService.updateTrip(updatedTripDto);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Trip)
  async addPossibleTravelBuddy(
    @Args('tripId') tripId: string ,
    @Context() context: any
  ) {
    // Get user id from JWT
    const jwt = context.req.headers.authorization.replace('Bearer ', '');
    const user = this.jwtService.decode(jwt, { json: true }) as { id: string };
    
    // Add possible travel buddy to trip
    return this.tripService.addPossibleTravelBuddy(tripId, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Trip)
  async removePossibleTravelBuddy(
    @Args('travelBuddyDto') travelBuddyDto: TravelBuddyDto,
    @Context() context: any
  ) {
    // Get user id from JWT
    const jwt = context.req.headers.authorization.replace('Bearer ', '');
    const user = this.jwtService.decode(jwt, { json: true }) as { id: string };
    // Get trip
    const trip = await this.tripService.findOneById(travelBuddyDto.tripId);

    // Check if owner of trip and remove possible travel buddy
    if(user.id === trip.userId) {
      return this.tripService.removePossibleTravelBuddy(trip, travelBuddyDto.userId);
    }

    // Removing self as travel buddy
    if(user.id === travelBuddyDto.userId) {
      return this.tripService.removePossibleTravelBuddy(trip, travelBuddyDto.userId);
    }

    throw new HttpException('You are not the owner of this trip, and cannot remove another user as a possible travel buddy', HttpStatus.UNAUTHORIZED);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Trip)
  async promotePossibleTravelBuddy(
    @Args('travelBuddyDto') travelBuddyDto: TravelBuddyDto,
    @Context() context: any
  ) {
    // Get user id from JWT
    const jwt = context.req.headers.authorization.replace('Bearer ', '');
    const user = this.jwtService.decode(jwt, { json: true }) as { id: string };
    // Get trip
    const trip = await this.tripService.findOneById(travelBuddyDto.tripId);

    // Check if owner of trip and promote possible travel buddy
    if(user.id === trip.userId) {
      return this.tripService.promotePossibleTravelBuddy(trip, travelBuddyDto.userId);
    }

    throw new HttpException('You are not the owner of this trip, and cannot promote a possible travel buddy', HttpStatus.UNAUTHORIZED);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Trip)
  async demoteTravelBuddy(
    @Args('travelBuddyDto') travelBuddyDto: TravelBuddyDto,
    @Context() context: any
  ) {
    // Get user id from JWT
    const jwt = context.req.headers.authorization.replace('Bearer ', '');
    const user = this.jwtService.decode(jwt, { json: true }) as { id: string };
    // Get trip
    const trip = await this.tripService.findOneById(travelBuddyDto.tripId);

    // Check if owner of trip and demote travel buddy
    if(user.id === trip.userId) {
      return this.tripService.demoteTravelBuddy(trip, travelBuddyDto.userId);
    }

    throw new HttpException('You are not the owner of this trip, and cannot demote a travel buddy', HttpStatus.UNAUTHORIZED);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Trip)
  async removeTravelBuddy(
    @Args('travelBuddyDto') travelBuddyDto: TravelBuddyDto,
    @Context() context: any
  ) {
    // Get user id from JWT
    const jwt = context.req.headers.authorization.replace('Bearer ', '');
    const user = this.jwtService.decode(jwt, { json: true }) as { id: string };
    // Get trip
    const trip = await this.tripService.findOneById(travelBuddyDto.tripId);

    // Check if owner of trip and demote travel buddy
    if(user.id === trip.userId) {
      return this.tripService.removeTravelBuddy(trip, travelBuddyDto.userId);
    }

    throw new HttpException('You are not the owner of this trip, and cannot remove a travel buddy', HttpStatus.UNAUTHORIZED);
  }

  // REMOVE IN PROD
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async clearDatabaseTrips() {
    return this.tripService.clearDatabase();
  }
}
