import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from '../dto/create-lead.dto';

@ApiTags('leads')
@Controller('api/v1/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead (Public)' })
  @ApiResponse({
    status: 201,
    description: 'Lead created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }
}
