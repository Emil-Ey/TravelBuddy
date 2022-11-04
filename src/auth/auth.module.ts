import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserService } from 'src/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10000s' },
    }),
  ],
  providers: [AuthService, AuthResolver, UserService, JwtService]
})
export class AuthModule {}
