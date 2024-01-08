import { Module } from '@nestjs/common'

import { AdminsController } from '@mush/admins/admins.controller'
import { CoreModule } from '@mush/core-module/core.module'
import { UsersModule } from '@mush/users/users.module'
import { OffloadsModule } from '@mush/offloads/offloads.module'

@Module({
  imports: [CoreModule, UsersModule, OffloadsModule],
  controllers: [AdminsController],
  providers: [],
  exports: [],
})
export class AdminsModule {}
