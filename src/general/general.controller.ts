import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GeneralService } from './general.service';
import { ManagerAuthGuard } from 'src/guards/manager-auth.guard';
import { Stadium } from './entities/stadium.entity';

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
}
