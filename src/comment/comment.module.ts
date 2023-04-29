import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Comment } from './comment.entity';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { TripService } from 'src/trip/trip.service';
import { Trip } from 'src/trip/trip.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Trip, Comment]), PassportModule, HttpModule
  ],
  providers: [CommentResolver, CommentService, TripService, UserService, JwtStrategy, JwtService]
})
export class CommentModule {}
