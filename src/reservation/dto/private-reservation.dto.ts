import { User } from "src/user/entities/user.entity";

export class PrivateReservation{
    id: number;
    postalCode: number;
    message: string;
    accepted: number;
    date: Date;
    askingUser: User;
    receivingUserGender: string;
  }