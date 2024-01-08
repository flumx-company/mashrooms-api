import { IsString, MaxLength, MinLength, IsNotEmpty, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { PHONE_REGEX } from "@mush/core/utils";

export class CreateDriverDto {
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
    example: "Johnson",
    description: "Enter last name.",
    type: String,
  })
  readonly lastName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(PHONE_REGEX)
  @ApiProperty({
    example: "380681234567",
    description: "Enter the phone.",
    type: String,
  })
  readonly phone: string;
}
