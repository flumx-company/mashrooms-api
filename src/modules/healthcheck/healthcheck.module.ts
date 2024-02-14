import { Module } from '@nestjs/common'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { HealthcheckController } from './healthcheck.controller'

@Module({
  imports: [CoreModule],
  controllers: [HealthcheckController],
})
export class HealthcheckModule {}
