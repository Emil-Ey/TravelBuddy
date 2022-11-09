import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { TripModule } from './trip/trip.module';
import { CommentModule } from './comment/comment.module';
require('dotenv').config();

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req, res }) => ({ req, res }),
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      playground: true,
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url:
      `mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@0.0.0.0:${process.env.DATABASE_PORT}`,
      // `mongodb://localhost:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
      useNewUrlParser: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    CommonModule,
    TripModule,
    CommentModule,
  ],
})
export class AppModule {}

