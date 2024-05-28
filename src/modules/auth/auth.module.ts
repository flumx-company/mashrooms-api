import { Module } from '@nestjs/common'

import { CoreModule } from '@mush/modules/core-module/core.module'
import { UserModule } from '@mush/modules/core-module/user/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [CoreModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
