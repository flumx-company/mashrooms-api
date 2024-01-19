import { Module } from '@nestjs/common'

import { AdminController } from '@mush/modules/admin/admin.controller'
import { CoreModule } from '@mush/modules/core-module/core.module'
import { UserModule } from '@mush/modules/core-module/user/user.module'
import { OffloadModule } from '@mush/modules/offload/offload.module'

@Module({
  imports: [CoreModule, UserModule, OffloadModule],
  controllers: [AdminController],
  providers: [],
  exports: [],
})
export class AdminModule {}
