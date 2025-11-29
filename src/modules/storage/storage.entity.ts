import { Column, Entity, Index, ManyToOne } from 'typeorm'

import { ApiProperty } from '@nestjs/swagger'

import { Category } from '@mush/modules/category/category.entity'
import { Variety } from '@mush/modules/variety/variety.entity'
import { Wave } from '@mush/modules/wave/wave.entity'

import { DatedBasicEntity } from '@mush/core/basic-entities'
import { formatDateToDateTime, dateOnlyStringToUTCDate } from '@mush/core/utils'
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const KYIV_TZ = 'Europe/Kiev';

@Entity({ name: 'storages' })
export class Storage extends DatedBasicEntity {
  @ApiProperty({
    example: '2024-01-15',
    description: 'Storage date',
  })
  @Index()
  @Column({
    type: 'date',
    transformer: {
      from: (value: Date) => {
        return dayjs(value).tz(KYIV_TZ).format('YYYY-MM-DD');
      },
      to: (value: string) => {
        // value: "2025-11-29"
        // интерпретируем как 00:00 по Киеву → конвертим в UTC → сохраняем
        return dayjs.tz(value, 'YYYY-MM-DD', KYIV_TZ).utc().toDate();
      },
    },
  })
  date: Date

  @ApiProperty({ example: 100, description: 'Stored mushrooms by kg' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number

  @ManyToOne(() => Wave, (wave) => wave.storages)
  wave: Wave

  @ManyToOne(() => Variety, (variety) => variety.storages)
  variety: Variety

  @ManyToOne(() => Category, (category) => category.storages)
  category: Category
}
