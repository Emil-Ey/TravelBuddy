import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JwtDto, UserLoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';



@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => JwtDto)
    async login(@Args('userLoginDto') userLoginDto: UserLoginDto): Promise<JwtDto> {
        return this.authService.login(userLoginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Boolean)
    async logout() {
        return true
    }
}
