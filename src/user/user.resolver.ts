import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdatedUserDto, UserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(of => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  async createUser(@Args('userDto') userDto: UserDto) {
    return this.userService.createUser(userDto);
  }

  @Mutation(() => User)
  async updateUser(@Args('updatedUserDto')  updatedUserDto: UpdatedUserDto ) {
    return this.userService.updateUser(updatedUserDto);
  }

  @Mutation(() => Boolean)
  async clearDatabase() {
    return this.userService.clearDatabase();
  }
}
