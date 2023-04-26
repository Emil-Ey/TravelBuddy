import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateCommentDto {
  @Field()
  tripId: string;
  @Field()
  text: string;
}

@InputType()
export class UpdatedCommentDto {
  @Field()
  _id: string;
  @Field()
  text: string;
}