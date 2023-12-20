import {
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  Matches,
  IsArray,
  IsEmail,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { EPermission } from "../../../../core/enums/permissions";

export class CreateUserDto {
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
    description: "Enter first name.",
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

  @IsString()
  @MaxLength(15)
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

  @IsArray()
  @ApiProperty({
    example: [EPermission.READ_PERSONAL_DATA],
    description: "Add permissions.",
    type: Array,
  })
  readonly permissions: EPermission[];
}

//NOTE: This is temporary to create superadmin. It won't appear in production.
export class AddSuperaminUserDto {
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

  @IsString()
  @MaxLength(15)
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

  @IsArray()
  @ApiProperty({
    example: Object.values(EPermission),
    description: "Add permissions.",
    type: Array,
  })
  readonly permissions: EPermission[];
}
