import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module'

import { StoreContainerController } from './store-container.controller'
import { StoreContainer } from './store-container.entity'
import { StoreContainerService } from './store-container.service'

@Module({
  imports: [TypeOrmModule.forFeature([StoreContainer]), CoreModule],
  controllers: [StoreContainerController],
  providers: [StoreContainerService],
  exports: [StoreContainerService],
})
export class StoreContainerModule {}
