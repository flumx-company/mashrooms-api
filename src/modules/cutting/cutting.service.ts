import { Repository } from 'typeorm'

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Cutting } from './cutting.entity'

@Injectable()
export class CuttingService {
  constructor(
    @InjectRepository(Cutting)
    private cuttingRepository: Repository<Cutting>,
  ) {}
}
