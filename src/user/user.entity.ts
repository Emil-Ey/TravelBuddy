import { Field, ObjectType } from "@nestjs/graphql";
import { Comment } from "src/comment/comment.entity";
import { Trip } from "src/trip/trip.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, ObjectIdColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
  
  @Field()
  @Column({
      length: 200
  })
  description: string;

  @Field(() => [Trip])
  @OneToMany(() => Trip, (trip) => trip.user)
  trips: Trip[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @Field(() => [Trip])
  @ManyToMany(() => Trip, (trip) => trip.possibleTravelBuddies)
  possibleTrips: Trip[];

  @Field(() => [Trip])
  @ManyToMany(() => Trip, (trip) => trip.travelBuddies)
  acceptedTrips: Trip[];

  @Field()
  @Column({nullable: true})
  profileImgUrl: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated_at: Date;
}