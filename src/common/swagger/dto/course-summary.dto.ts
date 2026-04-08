import { ApiProperty } from '@nestjs/swagger';

export class CourseSummaryDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: '9dd4f06c-1d3f-428c-97f9-bd98a191d55a' })
  uuid!: string;

  @ApiProperty({ example: 'Frontend Kids' })
  title!: string;

  @ApiProperty({ example: 'frontend-kids' })
  slug!: string;
}