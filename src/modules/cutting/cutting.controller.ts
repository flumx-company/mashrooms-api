import { Controller } from '@nestjs/common'
import { ApiBadGatewayResponse, ApiTags } from '@nestjs/swagger'

import { ApiV1 } from '@mush/core/utils'

import { CuttingService } from './cutting.service'

@ApiTags('Cuttings')
@ApiBadGatewayResponse({
  status: 502,
  description: 'Something went wrong',
})
@Controller(ApiV1('cuttings'))
export class CuttingController {
  constructor(readonly cuttingService: CuttingService) {}
}
