import { Module } from "@nestjs/common";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";
import { CoreModule } from "../core-module/core.module";
import { UsersModule } from "../core-module/users/users.module";

@Module({
  imports: [CoreModule, UsersModule],
  controllers: [LoginController],
  providers: [LoginService],
  exports: [LoginService],
})
export class AuthModule {}
