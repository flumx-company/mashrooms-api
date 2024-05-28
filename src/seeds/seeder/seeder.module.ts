import { Logger, Module } from '@nestjs/common'

import { MysqlDatabaseProviderModule } from '@mush/seeds/provider'
import { UserSeederModule } from '@mush/seeds/user/user.module'

import { Seeder } from './seeder'

@Module({
  imports: [MysqlDatabaseProviderModule, UserSeederModule],
  providers: [Logger, Seeder],
})
export class SeederModule {}
