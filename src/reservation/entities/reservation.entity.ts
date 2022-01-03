import { LocationModel } from "src/location/entities/location.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reservation {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    message: string;

    @Column()
    accepted: number;

    @Column()
    date: Date;

    @ManyToOne(() => User, user => user.askedReservations)
    askingUser: User;

    @ManyToOne(() => User, user => user.receivedReservations)
    receivingUser: User;

    @ManyToOne(() => LocationModel)
    location: LocationModel;
}
