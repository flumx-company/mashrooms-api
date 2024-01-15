import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ClientsModule } from '@mush/modules/clients/clients.module'
import { CoreModule } from '@mush/modules/core-module/core.module'

import { OffloadsController } from './offloads.controller'
import { OffloadsEntity } from './offloads.entity'
import { OffloadsService } from './offloads.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([OffloadsEntity]),
    CoreModule,
    ClientsModule,
  ],
  controllers: [OffloadsController],
  providers: [OffloadsService],
  exports: [OffloadsService],
})
export class OffloadsModule {}
