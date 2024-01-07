import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommandRunnerModule } from 'nest-commander'

import { UsersService } from './users.service'
import { UsersEntity } from './users.entity'

import {
  ChangePasswordSuperadminCommand,
  CreateSuperadminCommand,
} from '@commands/index'

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), CommandRunnerModule],
  controllers: [],
  providers: [
    UsersService,
    CreateSuperadminCommand,
    ChangePasswordSuperadminCommand,
  ],
  exports: [
    UsersService,
    CreateSuperadminCommand,
    ChangePasswordSuperadminCommand,
  ],
})
export class UsersModule {}
