import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto, UpdatedCommentDto } from './comment.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAll(): Promise<Comment[]> {
    try {
      return await this.commentRepository.find();
    } catch (err: any) {
      Logger.error(err, "findAll comments");
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneById(id: string): Promise<Comment> {
    try {
      return await this.commentRepository.findOneBy({ _id: id });
    } catch (err: any) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
  }

  async findByUserId(userId: string): Promise<Comment[]> {
    try {
      return await this.commentRepository.find({ where: {userId: userId}});
    } catch (err: any) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
  }

  async findByTripId(tripId: string): Promise<Comment[]> {
    try {
      return await this.commentRepository.find({ where: {tripId: tripId}});
    } catch (err: any) {
      return [];
    }
  }

  async createComment(commentDto: CreateCommentDto, userId: string): Promise<Comment> {
    const comment = new Comment();

    // Check if comment is too long
    if(commentDto.text.length > 200) {
      throw new HttpException('Too long comment. Max 200 characters.', HttpStatus.BAD_REQUEST);
    }

    try {
      comment._id = uuidv4();
      comment.userId = userId;
      comment.tripId = commentDto.tripId;
      comment.text = commentDto.text;
      return await this.commentRepository.save(comment);
    } catch (err: any) {
      if(err instanceof HttpException) throw err
      Logger.error(err, "create comment")
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateComment(commentDto: UpdatedCommentDto, userId: string): Promise<Comment> {
    // Check if new comment text is too long
    if(commentDto.text.length > 200) {
      throw new HttpException('Too long comment. Max 200 characters.', HttpStatus.BAD_REQUEST);
    }

    // Get comment
    const comment = await this.findOneById(commentDto._id);

    // Check if user is the "owner" of the comment
    if(comment.userId != userId) throw new HttpException('You are not the owner of this comment.', HttpStatus.FORBIDDEN); 
    
    // Create new object with appended arrays
    let newObj = { 'text': commentDto.text }

    // Return the saved trip
    return this.commentRepository.save({...comment, ...newObj});
  }

  async removeComment(commentId: string, userId: string): Promise<Boolean> {
    // Get comment
    const comment = await this.findOneById(commentId);

    // Check if user is the "owner" of the comment
    if(comment.userId != userId) throw new HttpException('You are not the owner of this comment.', HttpStatus.FORBIDDEN); 
    
    try {
      await this.commentRepository.delete({ _id: commentId });
    } catch (err: any) {
      Logger.error(err, "remove comment");
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return true
  }

  // REMOVE IN PROD
  async clearDatabase(): Promise<Boolean> {
    await this.commentRepository.query('DELETE FROM "comment"');
    return true
  }
}
