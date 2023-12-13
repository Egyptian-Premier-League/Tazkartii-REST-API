import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GeneralService } from './general.service';
import { ManagerAuthGuard } from 'src/guards/manager-auth.guard';
import { Stadium } from './entities/stadium.entity';
import { CreateStadiumDto } from './dtos/create-stadium.dto';
import { Team } from './entities/team.entity';

@Controller('general')
@ApiTags('general')
export class GeneralController {
  constructor(private generalService: GeneralService) {}

  @Get('cities')
  @ApiOkResponse({
    description: 'Cities',
    type: String,
    isArray: true,
  })
  @ApiOperation({ summary: 'Used to get the available cities' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getCities() {
    return this.generalService.getCities();
  }

  @Get('stadiums')
  @UseGuards(ManagerAuthGuard)
  @ApiBearerAuth('JWT-auth-manager')
  @ApiOkResponse({
    description: 'Stadiums',
    type: Stadium,
    isArray: true,
  })
  @ApiOperation({ summary: 'Used to get the stadiums' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getStadiums() {
    return this.generalService.getStadiums();
  }

  @Get('teams')
  @UseGuards(ManagerAuthGuard)
  @ApiBearerAuth('JWT-auth-manager')
  @ApiOkResponse({
    description: 'Teams',
    type: Team,
    isArray: true,
  })
  @ApiOperation({ summary: 'Used to get the teams' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getTeams() {
    return this.generalService.getTeams();
  }

  @Post('stadium')
  @UseGuards(ManagerAuthGuard)
  @ApiBearerAuth('JWT-auth-manager')
  @ApiOperation({ summary: 'Used to create a stadium' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiCreatedResponse({
    description: 'Created Succesfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Stadium Created Succesfully',
        },
      },
    },
  })
  createStadium(@Body() body: CreateStadiumDto) {
    return this.generalService.createStadium(body);
  }
}
