import { CommandRunnerModule } from 'nest-commander'

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import {
  ChangePasswordSuperadminCommand,
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
    ChangePasswordSuperadminCommand,
  ],
  exports: [
    UserService,
    CreateSuperadminCommand,
    ChangePasswordSuperadminCommand,
  ],
})
export class UserModule {}
