import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, ObjectID } from 'typeorm';
import { UpdatedUserDto, UserDto } from './user.dto';
import { User } from './user.entity';
const argon2 = require('argon2');
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: MongoRepository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOneByEmail(username: string): Promise<User> {
        return await this.userRepository.findOneByOrFail({ username: username });
    }

    async createUser(userDto: UserDto): Promise<User> {
        const user = new User();
        try {
            user._id = uuidv4();
            const hashedPassword = await argon2.hash(userDto.password);
            user.username = userDto.username;
            user.description = userDto.description;
            user.password = hashedPassword;
            return this.userRepository.save(user);
        } catch (err) {
            Logger.log(err, 'createUser');
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

        await this.userRepository.update({"_id": updatedUserDto._id}, newObj)

        return await this.userRepository.findOneByOrFail({ _id: updatedUserDto._id });
    } 

    async clearDatabase(): Promise<Boolean> {
        this.userRepository.clear();
        return true
    }
}