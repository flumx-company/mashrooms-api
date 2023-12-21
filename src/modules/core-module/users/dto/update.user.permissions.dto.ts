import { IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { EPermission } from "../../../../core/enums/permissions";

export class UpdateUserPermissionsDto {
  @IsArray()
  @ApiProperty({
    example: [],
    description: "Update permissions.",
    type: Array,
  })
  readonly permissions: EPermission[];
}
