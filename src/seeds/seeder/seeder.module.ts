import { Logger, Module } from '@nestjs/common'

import { MysqlDatabaseProviderModule } from '@seeds/provider/provider.module'
import { UserSeederModule } from '@seeds/users/user.module'

import { Seeder } from './seeder'

@Module({
  imports: [MysqlDatabaseProviderModule, UserSeederModule],
  providers: [Logger, Seeder],
})
export class SeederModule {}
