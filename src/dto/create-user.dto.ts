import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @ValidateIf((o: CreateUserDto) => !o.phone)
  @IsEmail()
  email?: string;

  @ValidateIf((o: CreateUserDto) => !o.email)
  @IsString()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;
}
