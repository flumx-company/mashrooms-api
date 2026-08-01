import { Category } from '@mush/modules/category/category.entity';
import { CategoryService } from '@mush/modules/category/category.service';
import { Chamber } from '@mush/modules/chamber/chamber.entity';
import { ChamberService } from '@mush/modules/chamber/chamber.service';
import { Client } from '@mush/modules/client/client.entity';
import { ClientMovement } from '@mush/modules/client/client-movement.entity';
import { ClientMovementService } from '@mush/modules/client/client-movement.service';
import { ClientService } from '@mush/modules/client/client.service';
import { Cutting } from '@mush/modules/cutting/cutting.entity';
import { CuttingService } from '@mush/modules/cutting/cutting.service';
import { Driver } from '@mush/modules/driver/driver.entity';
import { DriverService } from '@mush/modules/driver/driver.service';
import { Employee } from '@mush/modules/employee/employee.entity';
import { EmployeeService } from '@mush/modules/employee/employee.service';
import { FileUploadService } from '@mush/modules/file-upload/file-upload.service';
import { PublicFile } from '@mush/modules/file-upload/public-file.entity';
import { OffloadRecord } from '@mush/modules/offload-record/offload-record.entity';
import { OffloadRecordService } from '@mush/modules/offload-record/offload-record.service';
import { Offload } from '@mush/modules/offload/offload.entity';
import { OffloadService } from '@mush/modules/offload/offload.service';
import { Price } from '@mush/modules/price/price.entity';
import { PriceService } from '@mush/modules/price/price.service';
import { Shift } from '@mush/modules/shift/shift.entity';
import { ShiftService } from '@mush/modules/shift/shift.service';
import { Storage } from '@mush/modules/storage/storage.entity';
import { StorageService } from '@mush/modules/storage/storage.service';
import { StoreContainer } from '@mush/modules/store-container/store-container.entity';
import { StoreContainerService } from '@mush/modules/store-container/store-container.service';
import { Variety } from '@mush/modules/variety/variety.entity';
import { VarietyService } from '@mush/modules/variety/variety.service';
import { WaveModule } from '@mush/modules/wave/wave.module';
import { WorkRecord } from '@mush/modules/work-record/work.record.entity';
import { WorkRecordService } from '@mush/modules/work-record/work.record.service';
import { Work } from '@mush/modules/work/work.entity';
import { WorkService } from '@mush/modules/work/work.service';
import { Yield } from '@mush/modules/yield/yield.entity';
import { YieldService } from '@mush/modules/yield/yield.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BatchModule } from '@mush/modules/batch/batch.module';
import { CoreModule } from '@mush/modules/core-module/core.module';
import { ShiftModule } from '@mush/modules/shift/shift.module';

import { WateringController } from './watering.controller';
import { Watering } from './watering.entity';
import { WateringService } from './watering.service';
import {BonusShiftEntity} from "@mush/modules/shift/bonus.shift.entity";
import {ShiftOffload} from "@mush/modules/offload/shift-offload.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Watering,
      Shift,
      BonusShiftEntity,
      Employee,
      Cutting,
      Offload,
      WorkRecord,
      Price,
      PublicFile,
      Category,
      Variety,
      Storage,
      Client,
      ClientMovement,
      Driver,
      StoreContainer,
      Yield,
      OffloadRecord,
      Work,
      Chamber,
      ShiftOffload
    ]),
    CoreModule,
    ShiftModule,
    BatchModule,
    WaveModule,
  ],
  controllers: [WateringController],
  providers: [
    WateringService,
    ShiftService,
    EmployeeService,
    CuttingService,
    OffloadService,
    WorkRecordService,
    PriceService,
    FileUploadService,
    CategoryService,
    VarietyService,
    StorageService,
    ClientService,
    ClientMovementService,
    DriverService,
    StoreContainerService,
    YieldService,
    OffloadRecordService,
    WorkService,
    ChamberService,
  ],
  exports: [WateringService],
})
export class WateringModule {
}
