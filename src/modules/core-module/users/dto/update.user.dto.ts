import {
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsEmail,
  Matches,
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
    example: "John",
    description: "Enter first name.",
    type: String,
  })
  readonly firstName: string;

  @IsString()
  @MaxLength(35)
  @MinLength(1)
  @IsNotEmpty()
  @ApiProperty({
    example: "John",
    description: "Enter last name.",
    type: String,
  })
  readonly lastName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: "test@gmail.com",
    description: "Enter the email address.",
    type: String,
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/)
  @ApiProperty({
    example: "+380681234567",
    description: "Enter the phone.",
    type: String,
  })
  readonly phone: string;

  @IsArray()
  @ApiProperty({
    example: [],
    description: "Update permissions.",
    type: Array,
  })
  readonly permissions: EPermission[];
}
