import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UpdatedUserDto, UserDto } from './user.dto';
import { User } from './user.entity';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
const argon2 = require('argon2');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService,
  ) {}
  

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (err: any) {
      Logger.error(err, "findAll users");
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findUsersByIds(ids: string[]): Promise<User[]> {
    if(ids.length < 1) return []
    console.log("USER IDS ", ids)
    try {
      return await this.userRepository.createQueryBuilder()
      .where("User._id IN (:...userIds)", { userIds: ids })
      .getMany();
    } catch (err: any) {
      Logger.error(err, "findAll users by ids");
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

    if(userDto.description.length > 200) {
      throw new HttpException('Too long description. Max 200 characters.', HttpStatus.BAD_REQUEST);
    }

    try {
      user._id = uuidv4();
      const hashedPassword = await argon2.hash(userDto.password);
      user.username = userDto.username;
      user.description = userDto.description;
      user.password = hashedPassword;
      user.profileImgUrl = "";
      try {
        return await this.userRepository.save(user);
      } catch (err: any) {
        throw new HttpException('Username taken.', HttpStatus.CONFLICT);
      }
    } catch (err: any) {
      if(err instanceof HttpException) throw err
      Logger.error(err, "create user")
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  } 

  async updateUser(id: string, updatedUserDto: UpdatedUserDto): Promise<User> {
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
        Logger.error(err, 'updateUser');
        throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    newObj = {
      ...(updatedUserDto.username && { 'username': updatedUserDto.username}), 
      ...(updatedUserDto.description && { 'description': updatedUserDto.description}),
      ...(updatedUserDto.password && { 'password': hashedPassword})
    }

    try {
      await this.userRepository.update({"_id": id}, newObj)
    } catch (err: any) {
      Logger.error(err, "updateUser, updating database");
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Cannot return object when saving, so we must find it again and return it.
    return this.findOneById(id)
  } 

  async updateUserWithProfieImg(file: FileUpload, userId: string): Promise<User> {
    let {filename ,mimetype, encoding, createReadStream} = file
    let fileExtension = filename.split('.').pop();

    // Get user
    const user = await this.findOneById(userId);

    new Promise(async (resolve, reject) =>
    createReadStream()
      .pipe(createWriteStream(__dirname + `/uploads/${user._id + "." + fileExtension}`))
      .on("finish", () => resolve(true))
      .on("error", (err: any) => {console.log(err); reject()})
    );

    // Create new object with appended arrays
    let newObj = { 'profileImgUrl': `/uploads/${user._id + "." + fileExtension}` }

    // Return the saved trip
    return this.userRepository.save({...user, ...newObj});
  }

  // REMOVE IN PROD
  async clearDatabase(): Promise<Boolean> {
    await this.userRepository.query('DELETE FROM "user"');
    return true
  }
}