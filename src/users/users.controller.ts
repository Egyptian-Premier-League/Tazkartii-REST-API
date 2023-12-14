import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ViewUserDto } from './dtos/view-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { EditUserDto } from './dtos/edit-user.dto';
import { EditUserPasswordDto } from './dtos/edit-user-password.dto';
import { Seat } from 'src/general/entities/seat.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('my-data')
  @Serialize(ViewUserDto)
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Used to get the user data' })
  @ApiOkResponse({
    description: 'User Data',
    type: ViewUserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getMyData(@CurrentUser() user: User) {
    return this.userService.getUserData(user.id);
  }

  @Post('edit-my-data')
  @Serialize(ViewUserDto)
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary:
      'Used to edit the user data(Cant send Username or email or password)',
  })
  @ApiCreatedResponse({
    description: 'User Data after update',
    type: ViewUserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  updateMyData(@CurrentUser() user: User, @Body() userData: EditUserDto) {
    return this.userService.editUserData(user.id, userData);
  }

  @Post('edit-my-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Used to edit the user password' })
  @ApiCreatedResponse({
    description: 'Password Changed Succesfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Password Changed Succesfully',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  editUserPassword(
    @CurrentUser() user: User,
    @Body() userData: EditUserPasswordDto,
  ) {
    return this.userService.editUserPassword(user.id, userData);
  }

  @Get('my-reservations')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ type: Seat, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getUserReservations(@CurrentUser() user: User) {
    return this.userService.getMyReservations(user.id);
  }
}
