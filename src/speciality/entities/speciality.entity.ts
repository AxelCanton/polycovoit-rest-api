import { User } from "src/user/entities/user.entity";
import { Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Speciality {

    @PrimaryColumn()
    specialityName: string;

    @OneToMany(() => User, user => user.speciality)
    users: User[];
}
