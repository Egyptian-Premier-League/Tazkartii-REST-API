import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GeneralService } from './general.service';
import { ManagerAuthGuard } from 'src/guards/manager-auth.guard';
import { Stadium } from './entities/stadium.entity';
import { CreateStadiumDto } from './dtos/create-stadium.dto';
import { Team } from './entities/team.entity';
import { CreateMatchDto } from './dtos/create-match-dto';
import { ReserveSeatDto } from './dtos/reserve-seat-dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { SeatReservationDocumentation } from 'src/documentation-classes/seat-reservation.documentation';
import { ErrorSeatReservationDocumentation } from 'src/documentation-classes/error-seat-reservation.documentation';
import { Match } from './entities/match.entity';

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

  @Post('create-match')
  @UseGuards(ManagerAuthGuard)
  @ApiOperation({ summary: 'Used to create a match' })
  @ApiBearerAuth('JWT-auth-manager')
  @ApiCreatedResponse({
    description: 'Match Created Succesfully',
    schema: {
      type: 'object',
      properties: {
        matchId: {
          type: 'number',
          example: 3,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  createMatch(@Body() body: CreateMatchDto) {
    return this.generalService.createMatch(body);
  }

  @Post('reserve-seat')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Used to reserve seats' })
  @ApiCreatedResponse({
    type: SeatReservationDocumentation,
    isArray: true,
  })
  @ApiOkResponse({
    type: ErrorSeatReservationDocumentation,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  reserveSeat(@Body() body: ReserveSeatDto, @CurrentUser() user: User) {
    return this.generalService.reserveSeat(user, body);
  }

  @Get('matches')
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'the number of the page (must be positive >=1)',
    type: 'number',
  })
  @ApiOkResponse({
    description: 'Array of matches',
    isArray: true,
    type: Match,
  })
  @ApiOperation({ summary: 'Used to get the matches' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getMatches(@Query('page', ParseIntPipe) page: number) {
    if (page < 1)
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    return this.generalService.getMatches(page);
  }
}
