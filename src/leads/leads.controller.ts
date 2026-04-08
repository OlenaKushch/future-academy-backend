import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from '../dto/create-lead.dto';
import { CreateLeadResponseDto } from './dto/lead-response.dto';
import { ApiBadRequestErrorResponse } from '../common/swagger/decorators/api-error-responses.decorator';
import { SuccessMessage } from '../common/decorators/success-message.decorator';

@ApiTags('leads')
@Controller('api/v1/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @SuccessMessage('Lead created successfully')
  @ApiOperation({ summary: 'Create a new lead (Public)' })
  @ApiBody({ type: CreateLeadDto })
  @ApiCreatedResponse({
    description: 'Lead created successfully',
    type: CreateLeadResponseDto,
  })
  @ApiBadRequestErrorResponse('Invalid input data or course not found', [
    'Phone must match UA format +380XXXXXXXXX',
    'courseId must be a valid UUID',
  ])
  async create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }
}
