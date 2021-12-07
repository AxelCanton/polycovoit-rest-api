import { BadRequestException, Injectable } from '@nestjs/common';
import { PasswordService } from 'src/user/password.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private passwordService: PasswordService,
        private jwtService: JwtService
    ){}

    async validateUser(mail: string, password: string): Promise<any>{
        const user = await this.userService.findByMail(mail);

        if(user[0]){
            const validPassword = await this.passwordService.checkPassword(user[0].password, password);
            if(validPassword){
                const { password, ...res}  = user[0];
                return res;
            }
        }

        return null;    
    }

    async login(user: any){
        const accessTokenPayload = {
            mail: user.mail,
            sub: user.id,
            accessToken: true
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

    async refresh(refreshToken: string) {
        const data = await this.jwtService.verifyAsync<{
            sub: number;
            refresh_token?: boolean;
        }>(refreshToken);

        if (data.refresh_token) {
            const user = await this.userService.findOne(data.sub);
            if (user) {
                return await this.login(user);
            }
        }
        throw new BadRequestException('The provided token is not a refresh token');
    }
}
