import { Logger, UseGuards } from '@nestjs/common';
import { Args, Context, GraphQLExecutionContext, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatedUserDto, UserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService, private jwtService: JwtService) {}

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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async createUser(@Args('userDto') userDto: UserDto) {
    return this.userService.createUser(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async updateUser(@Args('updatedUserDto')  updatedUserDto: UpdatedUserDto ) {
    return this.userService.updateUser(updatedUserDto);
  }
  
  // REMOVE IN PROD
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async clearDatabase() {
    return this.userService.clearDatabase();
  }
}