import { Field, ObjectType } from "@nestjs/graphql";
import { Comment } from "src/comment/comment.entity";
import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, ObjectIdColumn, OneToMany, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class Trip {
    @Field()
    @ObjectIdColumn()
    _id: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.trips)
    user: User;

    @Field()
    @Column({nullable: false})
    userId: string;
    
    @Field(() => Comment)
    @OneToMany(() => Comment, (comment) => comment.trip)
    @JoinTable()
    comments: Comment[]

    @Field()
    @Column()
    country: String;

    @Field()
    @Column({
        length: 400
    })
    description: string;

    @Field()
    @Column()
    numberOfTravelBuddies: number;

    @Field(() => [User])
    @OneToMany(() => User, (user) => user.possibleTrips)
    possibleTravelBuddies: User[];

    @Field(() => [User])
    @OneToMany(() => User, (user) => user.acceptedTrips)
    travelBuddies: User[];

    @Field()
    @Column()
    openForMoreTravelBuddies: Boolean;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;
}