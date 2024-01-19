import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Category } from '@mush/modules/category/category.entity'
import { Client } from '@mush/modules/client/client.entity'
import { User } from '@mush/modules/core-module/user/user.entity'
import { Offload } from '@mush/modules/offload/offload.entity'
import { Picking } from '@mush/modules/picking/picking.entity'
import { Yield } from '@mush/modules/yield/yield.entity'

import { UserSeederService } from './user.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Offload, Client, Category, Picking, Yield]),
  ],
  providers: [UserSeederService],
  controllers: [UserSeederService],
  exports: [UserSeederService],
})
export class UserSeederModule {}
