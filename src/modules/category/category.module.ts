import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule } from '@mush/modules/core-module/core.module'

import { Category } from './category.entity'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'

@Module({
  imports: [TypeOrmModule.forFeature([Category]), CoreModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
