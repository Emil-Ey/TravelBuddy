import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, ObjectID } from 'typeorm';
import { UpdatedUserDto, UserDto } from './user.dto';
import { User } from './user.entity';
const argon2 = require('argon2');
import { v4 as uuidv4 } from 'uuid';
import { UsernameExistsException } from 'src/common/exceptions';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: MongoRepository<User>,
    ) {}
    

    async findAll(): Promise<User[]> {
        try {
            return await this.userRepository.find();
        } catch (err: any) {
            Logger.log(err, "findAll");
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findOneById(id: string): Promise<User> {
        try {
            return await this.userRepository.findOneByOrFail({ _id: id });
        } catch (err: any) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }

    async findOneByUsername(username: string): Promise<User> {
        try {
            return await this.userRepository.findOneByOrFail({ username: username });
        } catch (err: any) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }

    async createUser(userDto: UserDto): Promise<User> {
        const user = new User();
        try {
            user._id = uuidv4();
            const hashedPassword = await argon2.hash(userDto.password);
            user.username = userDto.username;
            user.description = userDto.description;
            user.password = hashedPassword;
            try {
                return await this.userRepository.save(user);
            } catch (err: any) {
                throw new HttpException('Username taken.', HttpStatus.CONFLICT);
            }
        } catch (err: any) {
            if(err instanceof HttpException) throw err
            Logger.log(err, "create user")
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } 

    async updateUser(updatedUserDto: UpdatedUserDto): Promise<User> {
        let newObj = {}
        let hashedPassword = undefined

        if(updatedUserDto.description.length > 200) {
            throw new HttpException('Too long description', HttpStatus.BAD_REQUEST);
        }

        if(updatedUserDto.password) {
            try {
                hashedPassword = await argon2.hash(updatedUserDto.password);
                newObj = {'password': hashedPassword}
            } catch (err) {
                Logger.log(err, 'updateUser');
                throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        newObj = {
            ...(updatedUserDto.username && { 'username': updatedUserDto.username}), 
            ...(updatedUserDto.description && { 'description': updatedUserDto.description}),
            ...(updatedUserDto.password && { 'password': hashedPassword})
        }

        try {
            await this.userRepository.update({"_id": updatedUserDto._id}, newObj)
        } catch (err: any) {
            Logger.log(err, "updateUser, updating database");
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
            return await this.userRepository.findOneByOrFail({ _id: updatedUserDto._id });
        } catch (err: any) {
            Logger.log(err, "updateUser, getting user");
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    } 

    async clearDatabase(): Promise<Boolean> {
        this.userRepository.clear();
        return true
    }
}