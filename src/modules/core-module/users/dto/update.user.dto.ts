import {
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsEmail,
  Matches,
  IsEnum,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {
  LATIN_CYRILLIC_LETTER_NAME_REGEX,
  PHONE_REGEX,
} from "src/core/utils/regex";
import { EPosition } from "src/core/enums/positions";

export class UpdateUserDto {
  @IsString()
  @MaxLength(20)
  @MinLength(1)
  @IsNotEmpty()
  @Matches(LATIN_CYRILLIC_LETTER_NAME_REGEX)
  @ApiProperty({
    example: "John",
    description: "Enter first name.",
    type: String,
  })
  readonly firstName: string;

  @IsString()
  @MaxLength(50)
  @MinLength(1)
  @IsNotEmpty()
  @Matches(LATIN_CYRILLIC_LETTER_NAME_REGEX)
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
  @Matches(PHONE_REGEX)
  @ApiProperty({
    example: "+380681234567",
    description: "Enter the phone.",
    type: String,
  })
  readonly phone: string;

  @IsString()
  @IsEnum(EPosition)
  @ApiProperty({
    example: EPosition.FOREMAN,
    description: "Enter the position.",
    type: String,
  })
  readonly position: EPosition;
}
