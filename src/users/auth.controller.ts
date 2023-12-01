import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { Token } from 'src/documentation-classes/token.documentation';
import { LoginDto } from './dtos/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Used to signup a new user' })
  @ApiCreatedResponse({
    description: 'Created Successfully',
    type: Token,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async createUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Post('signin')
  @ApiOkResponse({ description: 'Signin success', type: Token })
  @ApiOperation({ summary: 'Used to signin' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @HttpCode(HttpStatus.OK)
  async signin(@Body() body: LoginDto) {
    return this.authService.signin(body.username, body.password);
  }
}
