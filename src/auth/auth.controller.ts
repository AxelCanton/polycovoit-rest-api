import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from 'src/utils/roles/public.decorator';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req){
    return await this.authService.login(req.user);
  }

  // @Post('refresh')
  //   async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
  //       return this.authService.refresh(refreshTokenDto.refresh_token);
  //   }
}
