import { Field, ObjectType } from "@nestjs/graphql";
import { Comment } from "src/comment/comment.entity";
import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class Trip {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @ManyToOne(() => User, (user) => user.trips)
  @JoinColumn({ name: 'userId' })
  user: User;
  
  @Column({ name: 'userId' })
  userId: string;
  
  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.trip)
  comments: Comment[];

  @Field()
  @Column()
  country: String;

  @Field()
  @Column({ length: 400 })
  description: string;

  @Field()
  @Column()
  numberOfTravelBuddies: number;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.possibleTrips, { cascade: true })
  @JoinTable()
  possibleTravelBuddies: User[];

  @Column("text", { array: true })
  possibleTravelBuddiesIds: string[];

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.acceptedTrips, { cascade: true })
  @JoinTable()
  travelBuddies: User[];

  @Column("text", { array: true })
  travelBuddiesIds: string[];

  @Field(() => Boolean)
  @Column()
  openForMoreTravelBuddies: Boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated_at: Date;
}