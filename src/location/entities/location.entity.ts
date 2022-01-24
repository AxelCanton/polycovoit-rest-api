import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("location")
export class LocationModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    country: string;

    @Column()
    postalCode: number;

    @Column()
    city: string;

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
