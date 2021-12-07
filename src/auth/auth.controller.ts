import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req){
    return await this.authService.login(req.user);
  }

  @Post('refresh')
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refresh(refreshTokenDto.refresh_token);
    }
}
