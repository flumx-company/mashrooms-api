import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ClientModule } from '@mush/modules/client/client.module'
import { CoreModule } from '@mush/modules/core-module/core.module'

import { OffloadController } from './offload.controller'
import { Offload } from './offload.entity'
import { OffloadService } from './offload.service'

@Module({
  imports: [TypeOrmModule.forFeature([Offload]), CoreModule, ClientModule],
  controllers: [OffloadController],
  providers: [OffloadService],
  exports: [OffloadService],
})
export class OffloadModule {}
