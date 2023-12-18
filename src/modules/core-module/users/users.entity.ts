import { Column, Entity } from "typeorm";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { DatedBasicEntity } from "src/core/basic.entity";
import { ERole } from "./enums/roles";
import { EPermission } from "./enums/permissions";

@Entity({ name: "users" })
export class UsersEntity extends DatedBasicEntity {
  @ApiProperty({ example: "John22", description: "User's name" })
  @Column({ length: 35, default: null, nullable: true })
  username: string;

  @ApiProperty({
    example: "123Abc!",
    description: "User's password",
  })
  @Exclude({ toPlainOnly: true }) //TODO: hide password in response
  @Column({ type: "varchar", default: null, nullable: true })
  password: string;

  @ApiProperty({
    example: 1,
    description:
      "User's role. 1 - admin, 2 - superadmin. Admin role  will be added automatically",
  })
  @Column({ type: "enum", enum: ERole, default: ERole.ADMIN })
  role: ERole;

  @ApiProperty({
    example: [],
    description: "User's permissions.",
  })
  @Column("simple-array", { nullable: true })
  permissions: EPermission[];
}
