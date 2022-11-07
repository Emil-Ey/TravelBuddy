import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtDto, UserLoginDto } from './auth.dto';
const argon2 = require('argon2');

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private jwtTokenService: JwtService,
    ) {}
    
    async login(userLoginDto: UserLoginDto): Promise<any>   {
        const user = await this.userService.findOneByUsername(userLoginDto.username);
        try {
            if (await argon2.verify(user.password, userLoginDto.password)) {
                delete user.password;
                return user;
            } else {
                throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
            }
        } catch (err) {
            Logger.log(err, 'validateUser');
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async generateJwt(user: User): Promise<JwtDto> {
        const payload = {
            id: user._id,
            username: user.username,
            description: user.description
        };
      
        return {
            accessToken: this.jwtTokenService.sign(payload),
        };
    }
}
