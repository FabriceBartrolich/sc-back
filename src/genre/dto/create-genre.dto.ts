import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateGenreDto {
    @ApiProperty()
    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    genre: string;
}
