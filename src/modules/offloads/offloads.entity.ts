import { Column, Entity, ManyToOne } from "typeorm";
import { DatedBasicEntity } from "src/core/basic.entity";
import { UsersEntity } from "../core-module/users/users.entity";

@Entity({ name: "offloads" })
export class OffloadsEntity extends DatedBasicEntity {
  @ManyToOne(() => UsersEntity, (user) => user.offloads)
  user: UsersEntity;
}
