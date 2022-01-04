import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Transform } from 'class-transformer';

@Entity("location")
export class LocationModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    postalCode: number;

    @Column()
    city: String;

    @Column('real')
    latitude: number;

    @Column('real')
    longitude: number;

    @ManyToOne(() => User, user => user.locations, {
        nullable: false,
        onDelete: "CASCADE"
    })
    user: User;

}
