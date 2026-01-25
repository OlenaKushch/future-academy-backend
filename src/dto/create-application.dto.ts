import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  userName: string;

  @IsString()
  @Matches(/^\+?\d{10,13}$/, { message: 'Невірний формат телефону' })
  phone: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsInt()
  @IsNotEmpty()
  courseId: number;
}
