import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Category } from '@mush/modules/category/category.entity'
import { ClientsEntity } from '@mush/modules/clients/clients.entity'
import { UsersEntity } from '@mush/modules/core-module/users/users.entity'
import { OffloadsEntity } from '@mush/modules/offloads/offloads.entity'
import { Picking } from '@mush/modules/picking/picking.entity'
import { Yield } from '@mush/modules/yield/yield.entity'

import { UserSeederService } from './user.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      OffloadsEntity,
      ClientsEntity,
      Category,
      Picking,
      Yield,
    ]),
  ],
  providers: [UserSeederService],
  controllers: [UserSeederService],
  exports: [UserSeederService],
})
export class UserSeederModule {}
