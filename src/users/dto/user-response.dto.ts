import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserListItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiPropertyOptional({
    example: 'manager@future-academy.com',
    nullable: true,
  })
  email?: string | null;

  @ApiPropertyOptional({ example: '+380123456789', nullable: true })
  phone?: string | null;

  @ApiProperty({ example: 'Anna Manager' })
  name!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.MANAGER })
  role!: UserRole;

  @ApiProperty({ example: '2026-03-24T10:00:00.000Z' })
  createdAt!: string;
}

export class CreatedUserResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiPropertyOptional({
    example: 'manager@future-academy.com',
    nullable: true,
  })
  email?: string | null;

  @ApiPropertyOptional({ example: '+380123456789', nullable: true })
  phone?: string | null;

  @ApiProperty({ example: 'Anna Manager' })
  name!: string;

  @ApiPropertyOptional({
    example: 'https://ui-avatars.com/api/?name=Anna+Manager&background=random',
    nullable: true,
  })
  avatar?: string | null;

  @ApiProperty({ enum: UserRole, example: UserRole.MANAGER })
  role!: UserRole;

  @ApiProperty({ example: '2026-03-24T10:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-24T10:00:00.000Z' })
  updatedAt!: string;
}

export class UserProfileResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiPropertyOptional({
    example: 'manager@future-academy.com',
    nullable: true,
  })
  email?: string | null;

  @ApiProperty({ example: 'Anna Manager' })
  name!: string;

  @ApiProperty({
    example: 'https://ui-avatars.com/api/?name=Anna+Manager&background=random',
  })
  avatar!: string;
}
