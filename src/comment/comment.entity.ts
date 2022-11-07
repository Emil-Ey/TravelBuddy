import { Trip } from "src/trip/trip.entity";
import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, ObjectIdColumn, UpdateDateColumn } from "typeorm";

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