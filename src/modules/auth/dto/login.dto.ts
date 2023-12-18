import {
  IsString,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
  IsEmail,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
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

  @IsString()
  @MaxLength(20)
  @MinLength(8)
  @IsNotEmpty()
  @Matches(
    /(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*_]{8,}/g
  )
  @ApiProperty({
    example: "123Abc!_z",
    description: "Enter password.",
    type: String,
  })
  readonly password: string;
}

// (?=.*[0-9]) - строка содержит хотя бы одно число;
// (?=.*[!@#$%^&*_]) - строка содержит хотя бы один спецсимвол;
// (?=.*[a-z]) - строка содержит хотя бы одну латинскую букву в нижнем регистре;
// (?=.*[A-Z]) - строка содержит хотя бы одну латинскую букву в верхнем регистре;
// [0-9a-zA-Z!@#$%^&*_]{8,} - строка состоит не менее, чем из 8 вышеупомянутых символов.
