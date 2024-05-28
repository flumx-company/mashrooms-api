import { Controller, Get } from '@nestjs/common'
import {
  ApiBadGatewayResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { ApiV1 } from '@mush/core/utils'

@ApiTags('Healthcheck')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('healthcheck'))
export class HealthcheckController {
  constructor() {}

  @Get()
  @ApiOperation({
    summary: 'Healthcheck.',
  })
  @ApiResponse({
    status: 200,
    description: 'Will return boolean if it works.',
    type: Boolean,
  })
  async healthcheck(): Promise<Boolean> {
    return true
  }
}
