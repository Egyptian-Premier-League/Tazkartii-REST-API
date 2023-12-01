import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Get,
  UseGuards,
  Query,
  ParseEnumPipe,
  BadRequestException,
} from '@nestjs/common';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { AdminsService, ApprovedOption, RolesOption } from './admins.service';
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
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentAdmin } from './decorators/current-admin.decorator';
import { Admin } from './entities/admin.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ViewUserDto } from 'src/users/dtos/view-user.dto';

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

  @Get('users')
  @Serialize(ViewUserDto)
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('JWT-auth-admin')
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'the number of the page (must be positive >=1)',
    type: 'number',
  })
  @ApiQuery({
    name: 'role',
    required: true,
    description: 'the role of the needed users',
    type: 'string',
    enum: RolesOption,
  })
  @ApiQuery({
    name: 'approved',
    required: true,
    description: 'the approved status of the needed users',
    type: 'string',
    enum: ApprovedOption,
  })
  @ApiOperation({ summary: 'Used to get the users using different filters' })
  @ApiOkResponse({
    description: 'Array of needed users',
    isArray: true,
    type: ViewUserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getUsers(
    @Query('page', ParseIntPipe) page: number,
    @Query('role', new ParseEnumPipe(RolesOption)) role: string,
    @Query('approved', new ParseEnumPipe(ApprovedOption)) approved: string,
  ) {
    if (page < 1)
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    return this.adminService.getUsers(page, role, approved);
  }
}
