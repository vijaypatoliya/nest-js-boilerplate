import {Column, Entity, ObjectID, ObjectIdColumn} from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';

@Entity()
export class User {

    @ObjectIdColumn()
    _id: ObjectID;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    userName: string;

    @Column()
    @IsEmail()
    emailAddress: string;

    @Column()
    invitationCode: string;

    @Column()
    @MinLength(8)
    password_clear: string;

    @Column()
    password: string;

    @Column()
    userType: string;

    @Column()
    userStatus: string;

    @Column()
    created: string;

    @Column()
    token: string;

}
