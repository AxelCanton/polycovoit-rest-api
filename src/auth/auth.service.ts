import { BadRequestException, Injectable } from '@nestjs/common';
import { PasswordService } from 'src/user/password.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private passwordService: PasswordService,
        private jwtService: JwtService
    ){}

    async validateUser(email: string, password: string): Promise<User | null>{
        const user: User = await this.userService.findByMail(email);
        if(user){
            const validPassword: boolean = await this.passwordService.checkPassword(password, user.password);
            if(validPassword){
                return user;
            }
        }
        return null;    
    }

    async login(user: any){
        const accessTokenPayload = {
            email: user.email,
            sub: user.id
        }

        const refreshTokenPayload = {
            sub: user.id,
            refreshToken: true
        }

        return {
            access_token: await this.jwtService.signAsync(accessTokenPayload),
            refresh_token: await this.jwtService.signAsync(refreshTokenPayload, {
                expiresIn: '2d'
            })
        }
    }

    // async refresh(refreshToken: string) {
    //     const data = await this.jwtService.verifyAsync<{
    //         sub: number;
    //         refresh_token?: boolean;
    //     }>(refreshToken);

    //     if (data.refresh_token) {
    //         const user = await this.userService.findOne(data.sub);
    //         if (user) {
    //             return await this.login(user);
    //         }
    //     }
    //     throw new BadRequestException('The provided token is not a refresh token');
    // }
}
