import { User } from "src/user/user.entity";

export class CommentDto {
    _id: string;
    user: User;
    text: string;
}

export class CreateCommentDto {
    tripId: string;
    text: string;
}

export class UpdatedCommentDto {
    _id: string;
    text: string;
}