import { Logger, Module } from "@nestjs/common";
import { MysqlDatabaseProviderModule } from "../provider/provider.module";
import { Seeder } from "./seeder";
import { UserSeederModule } from "../users/user.module";

@Module({
  imports: [MysqlDatabaseProviderModule, UserSeederModule],
  providers: [Logger, Seeder],
})
export class SeederModule {}
