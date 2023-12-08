import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(60)
  @IsNotEmpty()
  password: string;
}
