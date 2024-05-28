import { CommandRunnerModule } from 'nest-commander'

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import {
  ChangeSuperadminPasswordCommand,
  CreateSuperadminCommand,
} from '@mush/commands'

import { User } from './user.entity'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommandRunnerModule],
  controllers: [],
  providers: [
    UserService,
    CreateSuperadminCommand,
    ChangeSuperadminPasswordCommand,
  ],
  exports: [
    UserService,
    CreateSuperadminCommand,
    ChangeSuperadminPasswordCommand,
  ],
})
export class UserModule {}
