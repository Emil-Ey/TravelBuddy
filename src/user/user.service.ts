import { Injectable } from '@nestjs/common';
import { Query } from '@nestjs/graphql';

@Injectable()
export class UserService {
    @Query(() => String)
    async hello() {
        return "hello world"
    }
}
