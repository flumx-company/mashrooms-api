import {
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsNumber,
  IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { EPermission } from "../../../../core/enums/permissions";

export class UpdateUserDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 5,
    description: "Enter user id.",
    type: Number,
  })
  readonly id: number;

  @IsString()
  @MaxLength(35)
  @MinLength(1)
  @IsNotEmpty()
  @ApiProperty({
    example: "John22",
    description: "Enter username.",
    type: String,
  })
  readonly username: string;

  @IsArray()
  @ApiProperty({
    example: [],
    description: "Update permissions.",
    type: Array,
  })
  readonly permissions: EPermission[];
}
