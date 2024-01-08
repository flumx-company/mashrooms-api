import { Module } from '@nestjs/common'

import { AdminsController } from '@mush/modules/admins/admins.controller'
import { CoreModule } from '@mush/modules/core-module/core.module'
import { UsersModule } from '@mush/modules/core-module/users/users.module'
import { OffloadsModule } from '@mush/modules/offloads/offloads.module'

@Module({
  imports: [CoreModule, UsersModule, OffloadsModule],
  controllers: [AdminsController],
  providers: [],
  exports: [],
})
export class AdminsModule {}
