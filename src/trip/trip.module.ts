import { Module } from '@nestjs/common';
import { TripResolver } from './trip.resolver';
import { TripService } from './trip.service';

@Module({
  providers: [TripResolver, TripService]
})
export class TripModule {}
