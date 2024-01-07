import { Module } from '@nestjs/common'

import { AdminsController } from '@admins/admins.controller'
import { CoreModule } from '@core-module/core.module'
import { UsersModule } from '@users/users.module'
import { OffloadsModule } from '@offloads/offloads.module'

@Module({
  imports: [CoreModule, UsersModule, OffloadsModule],
  controllers: [AdminsController],
  providers: [],
  exports: [],
})
export class AdminsModule {}
