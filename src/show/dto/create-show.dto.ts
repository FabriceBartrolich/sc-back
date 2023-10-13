import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateShowDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  is_finished: boolean;

  @ApiProperty()
  @IsString()
  description: string | null;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  image: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id_user: number;
}
