import { LocationModel } from "../../location/entities/location.entity";
import { Reservation } from "../../reservation/entities/reservation.entity";
import { Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany, ManyToOne } from "typeorm";
import { Exclude } from 'class-transformer';
import { Speciality } from "src/speciality/entities/speciality.entity";

export const UNIQUE_MAIL = 'UNIQUE_MAIL'
export const UNIQUE_USERNAME = 'UNIQUE_USERNAME'

@Entity()
@Unique(UNIQUE_MAIL, ['email'])
@Unique(UNIQUE_USERNAME, ['username'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    gender: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    isValid: boolean;

    @Column({
        default: ''
    })
    @Exclude()
    refreshToken: string;

    @Column()
    isAdmin: boolean;

    @Column({
        nullable: true,
    })
    expiryDate: Date;

    @Column()
    creationDate: Date;

    @OneToMany(() => LocationModel, location => location.user)
    locations: LocationModel[];

    @OneToMany(() => Reservation, reservation => reservation.askingUser)
    askedReservations: Reservation[];

    @OneToMany(() => Reservation, reservation => reservation.receivingUser)
    receivedReservations: Reservation[];

    // Should be Speciality entity if it was implemented
    @ManyToOne(() => Speciality, speciality => speciality.specialityName)
    speciality: Speciality;
}