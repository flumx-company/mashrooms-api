import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'
import { ClientsModule } from '@mush/modules/clients/clients.module'

import { OffloadsEntity } from './offloads.entity'
import { OffloadsController } from './offloads.controller'
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
