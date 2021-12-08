import { LocationModel } from "../../location/entities/location.entity";
import { Reservation } from "../../reservation/entities/reservation.entity";
import { Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany } from "typeorm";
import { Exclude } from 'class-transformer';

export const UNIQUE_MAIL = 'UNIQUE_MAIL'

@Entity()
@Unique(UNIQUE_MAIL, ['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    isAdmin: boolean;

    @OneToMany(() => LocationModel, location => location.user)
    locations: LocationModel[];

    @OneToMany(() => Reservation, reservation => reservation.askingUser)
    askedReservations: Reservation[];

    @OneToMany(() => Reservation, reservation => reservation.receivingUser)
    receivedReservations: Reservation[];
}