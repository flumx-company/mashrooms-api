import { Module } from '@nestjs/common'

import { ScheduleModule } from "@nestjs/schedule";
import { BackupService } from "@mush/modules/backup/backup.service";

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [],
  providers: [BackupService],
  exports: [],
})
export class BackupModule {}
