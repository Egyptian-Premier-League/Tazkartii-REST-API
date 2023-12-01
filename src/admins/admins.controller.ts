import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { AdminsService } from './admins.service';
import { AdminAuthGuard } from 'src/guards/admin-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentAdmin } from './decorators/current-admin.decorator';
import { Admin } from './entities/admin.entity';

@Controller('admins')
export class AdminsController {
  constructor(private adminService: AdminsService) {}

  @Post('create-admin')
  @UseGuards(AdminAuthGuard)
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Admin Created Succesfully',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiBearerAuth('JWT-auth-admin')
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiOperation({
    summary:
      'Used to signup a new admin, JWT token is required and it must be with admin role',
  })
  async createAdmin(@Body() body: CreateAdminDto) {
    await this.adminService.signup(body);
    return JSON.stringify({ message: 'Admin created successfully' });
  }

  @Post('approve-user/:userId')
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'the user id',
    type: 'number',
  })
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth-admin')
  @ApiOkResponse({
    description: 'User Approved Succesfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User Approved Succesfully',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Used to approve a user' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @HttpCode(HttpStatus.OK)
  approveUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.adminService.approveUser(userId);
  }
}
