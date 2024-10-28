import { BatchModule } from '@mush/modules/batch/batch.module';
import { BatchService } from '@mush/modules/batch/batch.service';
import { CategoryModule } from '@mush/modules/category/category.module';
import { Chamber } from '@mush/modules/chamber/chamber.entity';
import { ChamberService } from '@mush/modules/chamber/chamber.service';
import { Client } from '@mush/modules/client/client.entity';
import { ClientService } from '@mush/modules/client/client.service';
import { Cutting } from '@mush/modules/cutting/cutting.entity';
import { CuttingService } from '@mush/modules/cutting/cutting.service';
import { Driver } from '@mush/modules/driver/driver.entity';
import { DriverService } from '@mush/modules/driver/driver.service';
import { FileUploadService } from '@mush/modules/file-upload/file-upload.service';
import { PublicFile } from '@mush/modules/file-upload/public-file.entity';
import { OffloadRecord } from '@mush/modules/offload-record/offload-record.entity';
import { OffloadRecordService } from '@mush/modules/offload-record/offload-record.service';
import { Offload } from '@mush/modules/offload/offload.entity';
import { OffloadService } from '@mush/modules/offload/offload.service';
import { StorageModule } from '@mush/modules/storage/storage.module';
import { StorageService } from '@mush/modules/storage/storage.service';
import { StoreContainer } from '@mush/modules/store-container/store-container.entity';
import { StoreContainerService } from '@mush/modules/store-container/store-container.service';
import { VarietyModule } from '@mush/modules/variety/variety.module';
import { VarietyService } from '@mush/modules/variety/variety.service';
import { Watering } from '@mush/modules/watering/watering.entity';
import { WateringService } from '@mush/modules/watering/watering.service';
import { WaveModule } from '@mush/modules/wave/wave.module';
import { WaveService } from '@mush/modules/wave/wave.service';
import { WorkRecord } from '@mush/modules/work-record/work.record.entity';
import { WorkRecordService } from '@mush/modules/work-record/work.record.service';
import { Work } from '@mush/modules/work/work.entity';
import { WorkService } from '@mush/modules/work/work.service';
import { Yield } from '@mush/modules/yield/yield.entity';
import { YieldService } from '@mush/modules/yield/yield.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoreModule } from '@mush/modules/core-module/core.module';
import { EmployeeModule } from '@mush/modules/employee/employee.module';
import { PriceModule } from '@mush/modules/price/price.module';

import { ShiftController } from './shift.controller';
import { Shift } from './shift.entity';
import { ShiftService } from './shift.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Shift, Cutting, Offload, Client,
      Driver,
      StoreContainer,
      Yield,
      OffloadRecord,
      Work,
      Chamber,
      Watering,
      WorkRecord,
      PublicFile
    ]),
    CoreModule,
    EmployeeModule,
    PriceModule,
    VarietyModule,
    BatchModule,
    WaveModule,
    StorageModule,
    CategoryModule,
  ],
  controllers: [ShiftController],
  providers: [
    ShiftService, CuttingService, OffloadService, WateringService, WorkRecordService, ClientService,
    DriverService,
    StoreContainerService,
    YieldService,
    OffloadRecordService,
    WorkService,
    ChamberService,
    FileUploadService
  ],
  exports: [ShiftService],
})
export class ShiftModule {
}
