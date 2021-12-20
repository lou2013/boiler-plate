import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Headers,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import LoginDto from '../dto/login.dto';
import { AuthenticationService } from '../service/authentication.service';
import { LoginMethodDto } from '../dto/login-method.dto';
import { ChangePhoneNumberDto } from '../dto/change-phoneNumber.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UserDto } from '../../user/dto/user.dto';
import { SignupDto } from '../dto/signup.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { serverErrorDto } from '../../../../../common/dto/server-error.dto';
import { LocalAuthGuard } from '../../../../../common/guards/local-auth.guard';
import { JwtAuthGuard } from '../../../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../../common/decorators/current-user.decorator';
import { RefreshTokenGuard } from '../../../../../common/guards/jwt-refresh-token.guard';

@ApiTags('auth')
@Controller('/')
@ApiOkResponse({
  description: 'every thing was ok, the requested data was sent back',
})
@ApiBadRequestResponse({ description: 'invalid inputs', type: serverErrorDto })
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/login-by-password')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiOperation({
    summary: 'login with phoneNumber and password',
    description: 'login and return user data and set token on headers',
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  async loginByPassword(@Request() req): Promise<LoginResponseDto> {
    return await this.authenticationService.login(req.user, req.body.fcmToken);
  }

  @Post('/login')
  @ApiOperation({
    summary: 'login by method',
    description: 'login and return user data and set token on headers',
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  async login(@Body() body: LoginMethodDto): Promise<LoginResponseDto> {
    return await this.authenticationService.loginByMethod(body);
  }

  @Post('/change-phoneNumber')
  @ApiOperation({
    description:
      'this methods is used to change a password if a request without any code is sent it returns and sends a code to old phoneNumber ',
    summary: 'this method is used to change phoneNumber',
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async changePhoneNumber(
    @Body() changePhoneNumberDto: ChangePhoneNumberDto,
    @CurrentUser() user: UserDto,
  ): Promise<LoginResponseDto> {
    return await this.authenticationService.changePhoneNumber(
      changePhoneNumberDto,
      user,
    );
  }

  @Post('/change-password')
  @ApiOperation({
    summary: 'change password',
    description: 'change password and return user data',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: UserDto,
  })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: UserDto,
  ): Promise<UserDto> {
    return await this.authenticationService.changePassword(
      changePasswordDto,
      user,
    );
  }

  @Post('/refresh')
  @ApiOperation({
    description:
      'this route is used to get a new access token and another refresh token',
    summary: 'refresh token',
  })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiHeader({ name: 'refresh-token' })
  @ApiHeader({ name: 'fcm-token' })
  @UseGuards(RefreshTokenGuard)
  async refreshToken(
    @Headers('refresh-token') refresh_token,
    @Headers('fcm-token') fcmToken,
    @CurrentUser() user: UserDto,
  ): Promise<LoginResponseDto> {
    return this.authenticationService.refresh(refresh_token, user, fcmToken);
  }

  @Post('/sign-up')
  @ApiOperation({
    summary: 'signup',
    description: 'signup',
  })
  @ApiOkResponse({ type: LoginResponseDto })
  async signUp(@Body() signupDto: SignupDto): Promise<LoginResponseDto> {
    return await this.authenticationService.signUp(signupDto);
  }
}
