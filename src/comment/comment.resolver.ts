import { Args, Context, Mutation, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { Comment } from './comment.entity';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CommentService } from './comment.service';
import { TripService } from 'src/trip/trip.service';
import { Trip } from 'src/trip/trip.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCommentDto, UpdatedCommentDto } from './comment.dto';

@Resolver(Comment)
export class CommentResolver {
  constructor(private userService: UserService, private jwtService: JwtService, private commentService: CommentService, private tripService: TripService) {}


  @ResolveField("user", () => User)
  comment(@Root() comment: Comment) {
    return this.userService.findOneById(comment.userId);
  }

  @ResolveField("trip", () => Trip)
  trip(@Root() comment: Comment) {
    return this.tripService.findOneById(comment.tripId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Comment)
  async createComment(
    @Args('createCommentDto') createCommentDto: CreateCommentDto,
    @Context() context: any
  ) {
    const jwt = context.req.headers.authorization.replace('Bearer ', '');
    const user = this.jwtService.decode(jwt, { json: true }) as { id: string };
    return this.commentService.createComment(createCommentDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Comment)
  async updateComment(
    @Args('updatedCommentDto')  updatedCommentDto: UpdatedCommentDto,
    @Context() context: any
  ) {
    const jwt = context.req.headers.authorization.replace('Bearer ', '');
    const user = this.jwtService.decode(jwt, { json: true }) as { id: string };
    return this.commentService.updateComment(updatedCommentDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async removeComment(
    @Args('commentId')  commentId: string,
    @Context() context: any
  ) {
    const jwt = context.req.headers.authorization.replace('Bearer ', '');
    const user = this.jwtService.decode(jwt, { json: true }) as { id: string };
    return this.commentService.removeComment(commentId, user.id);
  }
  

  // REMOVE IN PROD
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async clearDatabaseUsers() {
    return this.commentService.clearDatabase();
  }

}