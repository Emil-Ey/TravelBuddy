import { Country } from "src/common/countries.enum";
import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, ObjectIdColumn, OneToMany, UpdateDateColumn } from "typeorm";

@Entity()
export class Comment {
    @ObjectIdColumn()
    _id: string;
    
    @ManyToOne(() => User, (user) => user.comments)
    user: User

    @ManyToOne(() => Trip, (trip) => trip.comments)
    @JoinTable()
    trip: Trip;

    @Column()
    text: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;
}

@Entity()
export class Trip {
    @ObjectIdColumn()
    _id: string;

    @ManyToOne(() => User, (user) => user.trips)
    user: User;
    
    @OneToMany(() => Comment, (comment) => comment.trip)
    @JoinTable()
    comments: Comment[]

    @Column()
    country: Country;

    @Column({
        length: 400
    })
    description: string;

    @Column()
    numberOfTravelBuddies: number;

    @OneToMany(() => User, (user) => user.possibleTrips)
    possibleTravelBuddies: User;

    @OneToMany(() => User, (user) => user.acceptedTrips)
    travelBuddies: User;

    @Column()
    openForMoreTravelBuddies: Boolean;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;
}