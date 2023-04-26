import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findOneById(id: string): Promise<Comment> {
    try {
      return await this.commentRepository.findOneBy({ _id: id });
    } catch (err: any) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
  }
}
