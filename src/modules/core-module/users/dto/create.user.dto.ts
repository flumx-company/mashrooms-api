import {
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
  Matches,
  IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { EPermission } from "../../../../core/enums/permissions";

export class CreateUserDto {
  @IsString()
  @MaxLength(35)
  @MinLength(1)
  @IsNotEmpty()
  @ApiProperty({
    example: "John2",
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

  @IsArray()
  @ApiProperty({
    example: Object.values(EPermission),
    description: "Add permissions.",
    type: Array,
  })
  readonly permissions: EPermission[];
}
