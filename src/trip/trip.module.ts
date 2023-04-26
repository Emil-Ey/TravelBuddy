import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Comment } from 'src/comment/comment.entity';
import { CommentService } from 'src/comment/comment.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Trip } from './trip.entity';
import { TripResolver } from './trip.resolver';
import { TripService } from './trip.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Trip, Comment]), PassportModule
  ],
  providers: [TripResolver, TripService, UserService, CommentService, JwtStrategy, JwtService],
})
export class TripModule {}
