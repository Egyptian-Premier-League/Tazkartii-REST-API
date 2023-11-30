import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { AdminsService } from './admins.service';
import { AdminAuthGuard } from 'src/guards/admin-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

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
}
