import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ClientsEntity } from "./clients.entity";
import { ClientsService } from "./clients.service";
import { ClientsController } from "./clients.controller";
import { CoreModule } from "../core-module/core.module";

@Module({
  imports: [TypeOrmModule.forFeature([ClientsEntity]), CoreModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
