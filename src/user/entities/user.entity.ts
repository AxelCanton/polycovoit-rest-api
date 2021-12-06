import { LocationModel } from "src/location/entities/location.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";
import { Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany } from "typeorm";

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

    @OneToMany(() => LocationModel, location => location.user)
    locations: LocationModel[];

    @OneToMany(() => Reservation, reservation => reservation.askingUser)
    askedReservations: Reservation[];

    @OneToMany(() => Reservation, reservation => reservation.receivingUser)
    receivedReservations: Reservation[];
}