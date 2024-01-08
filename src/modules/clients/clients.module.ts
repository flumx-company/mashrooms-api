import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { ClientsEntity } from './clients.entity'
import { ClientsService } from './clients.service'
import { ClientsController } from './clients.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ClientsEntity]), CoreModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
