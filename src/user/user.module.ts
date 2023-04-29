import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { User } from './user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { CommentService } from 'src/comment/comment.service';
import { Trip } from 'src/trip/trip.entity';
import { Comment } from 'src/comment/comment.entity';
import { TripService } from 'src/trip/trip.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Trip, Comment]), PassportModule, HttpModule
  ],
  providers: [UserResolver, UserService, JwtStrategy, JwtService, CommentService, TripService],
})
export class UserModule {}