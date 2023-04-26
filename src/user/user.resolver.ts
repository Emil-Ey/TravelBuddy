import { Logger, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatedUserDto, UserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Comment } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';
import { Trip } from 'src/trip/trip.entity';
import { TripService } from 'src/trip/trip.service';

@Resolver(User)
export class UserResolver {
  constructor(private userService: UserService, private jwtService: JwtService, private commentService: CommentService, private tripService: TripService) {}

  @ResolveField("comments", () => [Comment])
  comment(@Root() user: User) {
    let comments = [];
    user.comments?.forEach(async comment => {
      comments.push(await this.commentService.findOneById(comment._id))
    })
    return comments;
  }

  @ResolveField("trips", () => [Trip])
  trip(@Root() user: User) {
    let trips = [];
    user.trips?.forEach(async trip => {
      trips.push(await this.tripService.findOneById(trip._id))
    })
    return trips;
  }

  @ResolveField("possibleTrips", () => [Trip])
  possibleTrip(@Root() user: User) {
    let trips = [];
    user.possibleTrips?.forEach(async trip => {
      trips.push(await this.tripService.findOneById(trip._id))
    })
    return trips;
  }

  @ResolveField("acceptedTrips", () => [Trip])
  acceptedTrip(@Root() user: User) {
    let trips = [];
    user.acceptedTrips?.forEach(async trip => {
      trips.push(await this.tripService.findOneById(trip._id))
    })
    return trips;
  }

  // REMOVE IN PROD
  @UseGuards(JwtAuthGuard)
  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async user(@Context() context: any) {
    const jwt = context.req.headers.authorization.replace('Bearer ', '');
    const user = this.jwtService.decode(jwt, { json: true }) as { id: string };
    return this.userService.findOneById(user.id);
  }

  @Mutation(() => User)
  async createUser(@Args('userDto') userDto: UserDto) {
    return this.userService.createUser(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('updatedUserDto')  updatedUserDto: UpdatedUserDto,
    @Context() context: any
  ) {
    const jwt = context.req.headers.authorization.replace('Bearer ', '');
    const user = this.jwtService.decode(jwt, { json: true }) as { id: string };
    return this.userService.updateUser(user.id, updatedUserDto);
  }
  
  // REMOVE IN PROD
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async clearDatabaseUsers() {
    return this.userService.clearDatabase();
  }
}