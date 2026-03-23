import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateLeadDto {
  @ApiProperty({
    example: 'CONTACTED',
    description: 'Lead status',
    required: false,
    enum: ApplicationStatus,
  })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiProperty({
    example: 'Contact made via email',
    description: 'Additional notes about the lead',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
