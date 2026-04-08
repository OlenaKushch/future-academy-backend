import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '@prisma/client';
import { CourseSummaryDto } from '../../common/swagger/dto/course-summary.dto';

export class CreateLeadResponseDto {
  @ApiProperty({ example: 'success' })
  status!: string;

  @ApiProperty({ example: 'a4035b26-536c-4fbb-84f2-56df1c472e5d' })
  leadId!: string;
}

export class LeadResponseDto {
  @ApiProperty({ example: 'a4035b26-536c-4fbb-84f2-56df1c472e5d' })
  id!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ example: '+380123456789' })
  phone!: string;

  @ApiProperty({ example: 'john@example.com' })
  email!: string;

  @ApiPropertyOptional({
    example: 'Interested in evening classes',
    nullable: true,
  })
  message?: string | null;

  @ApiPropertyOptional({
    example: 'Called back, waiting for confirmation',
    nullable: true,
  })
  notes?: string | null;

  @ApiProperty({ enum: ApplicationStatus, example: ApplicationStatus.NEW })
  status!: ApplicationStatus;

  @ApiProperty({ example: 1 })
  courseId!: number;

  @ApiProperty({ type: CourseSummaryDto })
  course!: CourseSummaryDto;

  @ApiProperty({ example: '2026-03-24T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-24T10:05:00.000Z' })
  updatedAt!: string;
}

export class DeleteLeadResponseDto {
  @ApiProperty({ example: 'success' })
  status!: string;

  @ApiProperty({ example: 'Lead deleted successfully' })
  message!: string;
}