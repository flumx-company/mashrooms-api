import { IsNotEmpty, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateActiveStatusDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: true,
    description: "Enter user active status boolean value.",
    type: Boolean,
  })
  readonly isActive: boolean;
}
