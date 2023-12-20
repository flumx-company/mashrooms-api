import { Column, Entity } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { DatedBasicEntity } from "src/core/basic.entity";

@Entity({ name: "drivers" })
export class DriversEntity extends DatedBasicEntity {
  @ApiProperty({ example: "John", description: "User's first name" })
  @Column({ length: 35, default: null, nullable: true })
  firstName: string;

  @ApiProperty({ example: "Johnson", description: "User's last name" })
  @Column({ length: 35, default: null, nullable: true })
  lastName: string;

  @ApiProperty({
    example: "+380681234567",
    description: "Enter the phone.",
    type: String,
  })
  readonly phone: string;
}
