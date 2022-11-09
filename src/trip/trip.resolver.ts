import { Logger, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateTripDto } from './trip.dto';
import { Trip } from './trip.entity';
import { TripService } from './trip.service';

@Resolver(Trip)
export class TripResolver {
    constructor(private tripService: TripService, private userService: UserService, private jwtService: JwtService) {}

    @ResolveField('user', () => User)
    user(@Root() trip: Trip) {
        Logger.log("HLLO", "GETTING USER")
        return this.userService.findOneById(trip.userId);
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

    // REMOVE IN PROD
    @UseGuards(JwtAuthGuard)
    @Mutation(() => Boolean)
    async clearDatabaseTrips() {
        return this.tripService.clearDatabase();
    }
}
