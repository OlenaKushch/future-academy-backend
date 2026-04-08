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
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
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
import {
  DeleteLeadResponseDto,
  LeadResponseDto,
} from './dto/lead-response.dto';
import {
  ApiBadRequestErrorResponse,
  ApiForbiddenErrorResponse,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
} from '../common/swagger/decorators/api-error-responses.decorator';
import { SuccessMessage } from '../common/decorators/success-message.decorator';

@ApiTags('admin/leads')
@ApiBearerAuth()
@Controller('api/v1/admin/leads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminLeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @SuccessMessage('Leads retrieved successfully')
  @ApiOperation({ summary: 'Get all leads (Admin only)' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'],
  })
  @ApiQuery({
    name: 'courseId',
    required: false,
    type: String,
    description: 'Course numeric id or UUID',
  })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiOkResponse({
    description: 'List of all leads',
    type: LeadResponseDto,
    isArray: true,
  })
  @ApiBadRequestErrorResponse('Invalid query parameters', [
    'dateFrom must be a valid ISO 8601 date string',
  ])
  @ApiUnauthorizedErrorResponse('Unauthorized', 'Unauthorized')
  @ApiForbiddenErrorResponse(
    'Forbidden - User must have ADMIN role',
    'Admin access required',
  )
  async findAll(
    @GetUser() user: ActiveUserData,
    @Query() query: AdminLeadsQueryDto,
  ) {
    return this.leadsService.findAllForAdmin(user.userId ?? user.id, query);
  }

  @Get(':id')
  @SuccessMessage('Lead retrieved successfully')
  @ApiOperation({ summary: 'Get a single lead by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'a4035b26-536c-4fbb-84f2-56df1c472e5d',
  })
  @ApiOkResponse({
    description: 'Lead details',
    type: LeadResponseDto,
  })
  @ApiBadRequestErrorResponse(
    'Lead id must be a valid UUID v4',
    'Validation failed (uuid v4 is expected)',
  )
  @ApiUnauthorizedErrorResponse('Unauthorized', 'Unauthorized')
  @ApiForbiddenErrorResponse(
    'Forbidden - User must have ADMIN role',
    'Admin access required',
  )
  @ApiNotFoundErrorResponse('Lead not found', 'Lead not found')
  async findOne(
    @GetUser() user: ActiveUserData,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.leadsService.findOneForAdmin(user.userId ?? user.id, id);
  }

  @Patch(':id')
  @SuccessMessage('Lead updated successfully')
  @ApiOperation({ summary: 'Update a lead (Admin only)' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'a4035b26-536c-4fbb-84f2-56df1c472e5d',
  })
  @ApiOkResponse({
    description: 'Lead updated successfully',
    type: LeadResponseDto,
  })
  @ApiBadRequestErrorResponse(
    'Invalid input data',
    'At least one field must be provided',
  )
  @ApiUnauthorizedErrorResponse('Unauthorized', 'Unauthorized')
  @ApiForbiddenErrorResponse(
    'Forbidden - User must have ADMIN role',
    'Admin access required',
  )
  @ApiNotFoundErrorResponse('Lead not found', 'Lead not found')
  async update(
    @GetUser() user: ActiveUserData,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateLeadDto,
  ) {
    return this.leadsService.updateForAdmin(user.userId ?? user.id, id, dto);
  }

  @Delete(':id')
  @SuccessMessage('Lead deleted successfully')
  @ApiOperation({ summary: 'Delete a lead (Admin only)' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'a4035b26-536c-4fbb-84f2-56df1c472e5d',
  })
  @ApiOkResponse({
    description: 'Lead deleted successfully',
    type: DeleteLeadResponseDto,
  })
  @ApiUnauthorizedErrorResponse('Unauthorized', 'Unauthorized')
  @ApiForbiddenErrorResponse(
    'Forbidden - User must have ADMIN role',
    'Admin access required',
  )
  @ApiNotFoundErrorResponse('Lead not found', 'Lead not found')
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
