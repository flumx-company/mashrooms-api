import { Column, Entity } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { DatedBasicEntity } from "src/core/basic.entity";

@Entity({ name: "clients" })
export class ClientsEntity extends DatedBasicEntity {
  @ApiProperty({ example: "John", description: "User's first name" })
  @Column({ length: 35, default: null, nullable: true })
  firstName: string;

  @ApiProperty({ example: "Johnson", description: "User's last name" })
  @Column({ length: 35, default: null, nullable: true })
  lastName: string;

  //price?
}
