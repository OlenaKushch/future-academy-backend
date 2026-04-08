import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'SecurePassword123',
    description: 'Password (minimum 6 characters)',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name (minimum 2 characters)',
  })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({
    example: UserRole.MANAGER,
    description: 'User role (MANAGER or ADMIN)',
    required: false,
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
