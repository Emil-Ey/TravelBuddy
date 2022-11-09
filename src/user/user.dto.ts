import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UserDto {
    @Field()
    username: string;
    @Field()
    password: string;
    @Field()
    description: string;
}

@InputType()
export class UpdatedUserDto {
    @Field()
    username: string;
    @Field()
    password: string;
    @Field()
    description: string;
}