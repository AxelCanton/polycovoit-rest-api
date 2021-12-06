import { LocationModel } from "src/location/location/entities/location.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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
}