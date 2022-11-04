import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn()
    _id: string;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column({
        length: 200
    })
    description: string;
}