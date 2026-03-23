import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class AdminLeadsQueryDto {
  @ApiProperty({
    example: 'CONTACTED',
    description: 'Filter by lead status',
    required: false,
    enum: ApplicationStatus,
  })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'Filter by course UUID',
    required: false,
  })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiProperty({
    example: '2025-01-01',
    description: 'Filter leads from this date (ISO 8601 format)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Filter leads until this date (ISO 8601 format)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Search leads by name, phone, or email',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
