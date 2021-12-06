import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

export const UNIQUE_MAIL = 'UNIQUE_MAIL'

@Entity()
@Unique(UNIQUE_MAIL, ['mail'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    mail: string;

    @Column()
    password: string;
}