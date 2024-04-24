import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'
import { PublicFile } from '../file-upload/public-file.entity';
import { FileUploadModule } from '../file-upload/file-upload.module'
import { ClientController } from './client.controller'
import { Client } from './client.entity'
import { ClientService } from './client.service'

@Module({
  imports: [TypeOrmModule.forFeature([Client, PublicFile]), CoreModule, FileUploadModule],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
