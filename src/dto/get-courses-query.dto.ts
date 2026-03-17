import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetCoursesQueryDto {
  @ApiProperty({
    example: 1,
    description: 'Page number (starting from 1)',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiProperty({
    example: 10,
    description: 'Items per page (max 100)',
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @ApiProperty({
    example: 'JavaScript',
    description: 'Search courses by name or description',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
