import { Module } from '@nestjs/common'

import { CoreModule } from '@mush/modules/core-module/core.module'
import { UsersModule } from '@mush/modules/core-module/users/users.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [CoreModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
