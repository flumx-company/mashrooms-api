import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { ClientsController } from './clients.controller'
import { ClientsEntity } from './clients.entity'
import { ClientsService } from './clients.service'

@Module({
  imports: [TypeOrmModule.forFeature([ClientsEntity]), CoreModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
