import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { TripDto } from './trip.dto';
import { TripService } from './trip.service';

@Resolver()
export class TripResolver {
    constructor(private tripService: TripService, private jwtService: JwtService) {}

    @UseGuards(JwtAuthGuard)
    @Query(() => [TripDto])
    async trips() {
        return this.tripService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Query(() => TripDto)
    async trip(@Args('id') id: string) {
        return this.tripService.findOneById(id);
    }
}
