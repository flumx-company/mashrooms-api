import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm'

import { BasicEntity } from './basic.entity'

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const KYIV_TZ = 'Europe/Kyiv';
const KyivTimestampTransformer = {
  to: (value: Date | string) => {
    // Если value не передали (у CreateDateColumn часто undefined) —
    // сохраняем ТЕКУЩЕЕ время Киева
    const date = value
      ? dayjs(value)
      : dayjs().tz(KYIV_TZ);

    // Переводим Киев → UTC и пишем в базу
    return date.utc().toDate();
  },

  from: (value: Date) => {
    // База отдаёт UTC — переводим в Киев
    return dayjs(value).tz(KYIV_TZ).toDate();
  },
};
@Entity('dated-basic')
export class DatedBasicEntity extends BasicEntity {
  @CreateDateColumn({
    type: 'timestamp',
    // default: () => 'CURRENT_TIMESTAMP(6)',
    transformer: KyivTimestampTransformer,
  })
  public createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
    // default: () => 'CURRENT_TIMESTAMP(6)',
    // onUpdate: 'CURRENT_TIMESTAMP(6)',
    transformer: KyivTimestampTransformer,
  })
  public updatedAt: Date
}
