import { User } from "src/user/entities/user.entity";
import { OneToMany, PrimaryColumn } from "typeorm";

export class Speciality {

    @PrimaryColumn()
    specialityName: string;

    @OneToMany(() => User, user => user.speciality)
    users: User[];
}
