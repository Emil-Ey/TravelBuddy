import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class JwtDto {
  @Field()
  accessToken: string;
}

@InputType()
export class UserLoginDto {
  @Field()
  username: string;
  @Field()
  password: string;
}