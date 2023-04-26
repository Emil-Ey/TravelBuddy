import { Field, ObjectType } from "@nestjs/graphql";
import { Trip } from "src/trip/trip.entity";
import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class Comment {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  _id: string;
  
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments)
  user: User

  @Field(() => Trip)
  @ManyToOne(() => Trip, (trip) => trip.comments)
  @JoinTable()
  trip: Trip;

  @Field()
  @Column()
  text: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated_at: Date;
}