import { PrivateUserDto } from "src/user/dto/private-user.dto";

export class PrivateReservation{
    id: number;
    postalCode: number;
    message: string;
    accepted: number;
    date: Date;
    askingUser?: PrivateUserDto;
    receivingUser?: PrivateUserDto;
  }