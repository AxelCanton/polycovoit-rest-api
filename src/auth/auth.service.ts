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
        };

        const refreshTokenPayload = {
            sub: user.id,
            refreshToken: true
        };

        const accessToken = await this.jwtService.signAsync(accessTokenPayload)

        const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
            expiresIn: '14d'
        });

        this.userService.updateRefreshToken(refreshToken, user.id);

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        }
    }

    async refresh(refreshToken: string) {
        const data = await this.jwtService.verifyAsync<{
            sub: number;
            refreshToken?: boolean;
        }>(refreshToken);
        const userId = data.sub;

        if (data.refreshToken) {
            // Compare the provided refresh token with the one stored in the database
            const isValidRefreshToken = await this.userService.compareRefreshToken(refreshToken, userId);
            if(!isValidRefreshToken){
                /*
                If a user tries to refresh the token with an invalid refresh token (i.e. with an old refresh token),
                the current refresh token is invalided.
                This is meant to avoid a malicious user to retrieve an access token with an outdated refresh token
                */
                this.userService.updateRefreshToken("", userId);
                throw new BadRequestException('Invalid provided refresh token')
            }
            const user = await this.userService.findOne(userId);
            if (user) {
                return await this.login(user);
            }
        }
        throw new BadRequestException('The provided token is not a refresh token');
    }
}
