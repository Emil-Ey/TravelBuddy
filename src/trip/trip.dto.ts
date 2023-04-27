import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateTripDto {
	@Field()
  country: string;
	@Field()
  description: string;
  @Field()
	numberOfTravelBuddies: number;
}

@InputType()
export class UpdatedTripDto {
  @Field()
	_id: string;
	@Field()
	country: string;
	@Field()
	description: string;
	@Field()
	numberOfTravelBuddies: number;
	@Field()
	openForMoreTravelBuddies: Boolean;
}

@InputType()
export class TravelBuddyDto {
  @Field()
	tripId: string;
  @Field()
	userId: string;
}