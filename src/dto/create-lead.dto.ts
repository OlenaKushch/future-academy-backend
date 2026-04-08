import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the lead',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @ApiProperty({
    example: '+380123456789',
    description: 'Phone number in UA format (+380XXXXXXXXX)',
  })
  @IsString()
  @Matches(/^\+380\d{9}$/, {
    message: 'Phone must match UA format +380XXXXXXXXX',
  })
  phone!: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'UUID of the course',
  })
  @IsUUID('4', { message: 'courseId must be a valid UUID' })
  courseId!: string;

  @ApiProperty({
    example: 'Interested in this course',
    description: 'Optional message from the lead',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;
}
