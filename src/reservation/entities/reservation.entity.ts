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

    @ManyToOne(() => User, user => user.askedReservations, {
        nullable: false,
        onDelete: "CASCADE"
    })
    askingUser: User;

    @ManyToOne(() => User, user => user.receivedReservations, {
        nullable: false,
        onDelete: "CASCADE"
    })
    receivingUser: User;

    @ManyToOne(() => LocationModel, {
        nullable: false,
        onDelete: "CASCADE"
    })
    location: LocationModel;
}
