import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { ActiveUserData } from '../common/decorators/get-user.decorator';
import { AdminLeadsQueryDto } from './dto/admin-leads-query.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UserRole } from '@prisma/client';

@ApiTags('admin/leads')
@ApiBearerAuth()
@Controller('api/v1/admin/leads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminLeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all leads (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all leads',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User must have ADMIN role',
  })
  async findAll(
    @GetUser() user: ActiveUserData,
    @Query() query: AdminLeadsQueryDto,
  ) {
    return this.leadsService.findAllForAdmin(user.userId ?? user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single lead by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Lead details',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User must have ADMIN role',
  })
  @ApiResponse({
    status: 404,
    description: 'Lead not found',
  })
  async findOne(
    @GetUser() user: ActiveUserData,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.leadsService.findOneForAdmin(user.userId ?? user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lead (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Lead updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User must have ADMIN role',
  })
  @ApiResponse({
    status: 404,
    description: 'Lead not found',
  })
  async update(
    @GetUser() user: ActiveUserData,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateLeadDto,
  ) {
    return this.leadsService.updateForAdmin(user.userId ?? user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lead (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Lead deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User must have ADMIN role',
  })
  @ApiResponse({
    status: 404,
    description: 'Lead not found',
  })
  async remove(
    @GetUser() user: ActiveUserData,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    const result = await this.leadsService.deleteForAdmin(
      user.userId ?? user.id,
      id,
    );

    return result;
  }
}
