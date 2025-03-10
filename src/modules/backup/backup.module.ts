import { Module } from '@nestjs/common'

import { ScheduleModule } from "@nestjs/schedule";
import { BackupDatabaseService } from "@mush/modules/backup/backup.database.service";
import { BackupMinioService } from "@mush/modules/backup/backup.minio.service";

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [BackupDatabaseService, BackupMinioService],
  exports: [],
})
export class BackupModule {}
