import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BatchModule } from '@mush/modules/batch/batch.module'
import { CategoryModule } from '@mush/modules/category/category.module'
import { ClientModule } from '@mush/modules/client/client.module'
import { CoreModule } from '@mush/modules/core-module/core.module'
import { DriverModule } from '@mush/modules/driver/driver.module'
import { FileUploadModule } from '@mush/modules/file-upload/file-upload.module'
import { OffloadRecordModule } from '@mush/modules/offload-record/offload-record.module'
import { ShiftModule } from '@mush/modules/shift/shift.module'
import { StorageModule } from '@mush/modules/storage/storage.module'
import { StoreContainerModule } from '@mush/modules/store-container/store-container.module'
import { VarietyModule } from '@mush/modules/variety/variety.module'
import { WaveModule } from '@mush/modules/wave/wave.module'
import { YieldModule } from '@mush/modules/yield/yield.module'

import { OffloadController } from './offload.controller'
import { Offload } from './offload.entity'
import { OffloadService } from './offload.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Offload]),
    CoreModule,
    ClientModule,
    DriverModule,
    BatchModule,
    WaveModule,
    CategoryModule,
    VarietyModule,
    StoreContainerModule,
    StorageModule,
    YieldModule,
    OffloadRecordModule,
    ShiftModule,
    FileUploadModule,
  ],
  controllers: [OffloadController],
  providers: [OffloadService],
  exports: [OffloadService],
})
export class OffloadModule {}
