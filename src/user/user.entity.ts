import { Comment } from "src/comment/comment.entity";
import { Trip } from "src/trip/trip.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, ObjectIdColumn, OneToMany, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn()
    _id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;
    
    @Column({
        length: 200
    })
    description: string;

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => Trip, (trip) => trip.user)
    trips: Trip[];

    @ManyToOne(() => Trip, (trip) => trip.possibleTravelBuddies)
    possibleTrips: Trip[];

    @ManyToOne(() => Trip, (trip) => trip.travelBuddies)
    acceptedTrips: Trip[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;
}