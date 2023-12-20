import { Module } from "@nestjs/common";

import { AdminsController } from "./admins.controller";
import { CoreModule } from "../core-module/core.module";
import { UsersModule } from "../core-module/users/users.module";

@Module({
  imports: [CoreModule, UsersModule],
  controllers: [AdminsController],
  providers: [],
  exports: [],
})
export class AdminsModule {}
