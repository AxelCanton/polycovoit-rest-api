import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LocationModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    address: String;

    @Column()
    postalCode: number;

    @Column()
    city: String;

    @ManyToOne(() => User, user => user.locations)
    user: User;

}
