import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MaxLength(60)
    @IsNotEmpty()
    password: string;
}
