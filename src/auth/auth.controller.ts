import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from 'src/utils/roles/public.decorator';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiResponse({ status:200, description:"User logged in"})
  @HttpCode(200)
  async login(@Request() req){
    return await this.authService.login(req.user);
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refresh(refreshTokenDto.refreshToken);
    }
}
