import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'
import { Offload } from '@mush/modules/offload/offload.entity'
import { PublicFile } from '../file-upload/public-file.entity'
import { FileUploadModule } from '../file-upload/file-upload.module'
import { ClientController } from './client.controller'
import { Client } from './client.entity'
import { ClientMovement } from './client-movement.entity'
import { ClientMovementService } from './client-movement.service'
import { ClientService } from './client.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, ClientMovement, PublicFile, Offload]),
    CoreModule,
    FileUploadModule,
  ],
  controllers: [ClientController],
  providers: [ClientService, ClientMovementService],
  exports: [ClientService, ClientMovementService],
})
export class ClientModule {}
