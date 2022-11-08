import { CommentDto } from "src/comment/comment.dto";
import { User } from "src/user/user.entity"

export class TripDto {
    _id: string;
	user: User[];
	comments: CommentDto;
	country: string;
	description: string;
	numberOfTravelBuddies: number;
	possibleTravelBuddies: User[];
	travelBuddies: User[];
	openForMoreTravelBuddies: Boolean;
}

export class CreateTripDto {
    country: string;
    description: string;
    numberOfTravelBuddies: number;
}

export class UpdatedTripDto {
    _id: string;
	country: string;
	description: string;
	numberOfTravelBuddies: number;
	openForMoreTravelBuddies: Boolean;
}