/**
 * Сценарии из продакшн-инцидентов (резка в полночь, отгрузка в 21:00, журнал).
 * Запуск: npm run test:date-scenarios
 */
import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'

import {
  addOneOperationalCalendarDay,
  createdAtOperationalDayFromInstant,
  getCreatedAtUtcBoundsForCalendarDate,
  getOperationalCalendarDateString,
  getOperationalYesterdayDateString,
  getUtcCalendarDateString,
  normalizeJournalDateParam,
  transformPaginateOperationalDayCreatedAtFilter,
} from './date.utc'

dayjs.extend(utc)
dayjs.extend(timezone)

function inOperationalJournalDay(
  createdAt: Date,
  journalYmd: string,
): boolean {
  const { startUtc, endUtc } =
    getCreatedAtUtcBoundsForCalendarDate(journalYmd)
  return (
    createdAt.getTime() >= startUtc.getTime() &&
    createdAt.getTime() < endUtc.getTime()
  )
}

describe('Сценарии: журнал резки / холодильник', () => {
  it('18.05 00:24 Kyiv → журнал 18.05, не 17.05', () => {
    const cut = new Date('2026-05-18T00:24:00+03:00')
    expect(getOperationalCalendarDateString(cut)).toBe('2026-05-18')
    expect(inOperationalJournalDay(cut, '2026-05-18')).toBe(true)
    expect(inOperationalJournalDay(cut, '2026-05-17')).toBe(false)
  })

  it('16.05 00:30 Kyiv → operational 16.05, UTC-день 15.05 (старая ошибка)', () => {
    const cut = new Date('2026-05-16T00:30:00+03:00')
    expect(getOperationalCalendarDateString(cut)).toBe('2026-05-16')
    expect(getUtcCalendarDateString(cut)).toBe('2026-05-15')
  })

  it('26.05 00:30 Kyiv (21:30 UTC 25.05) → журнал и зарплата 26.05', () => {
    const cut = new Date('2026-05-25T21:30:00.000Z')
    expect(getOperationalCalendarDateString(cut)).toBe('2026-05-26')
    expect(createdAtOperationalDayFromInstant(cut)).toBe('2026-05-26')
    expect(inOperationalJournalDay(cut, '2026-05-26')).toBe(true)
    expect(inOperationalJournalDay(cut, '2026-05-25')).toBe(false)
  })
})

describe('Сценарии: отгрузка / клиентский отчёт 21:00', () => {
  it('24.05 20:59 Kyiv (17:59Z) → журнал 24.05', () => {
    const t = new Date('2026-05-24T17:59:00.000Z')
    expect(inOperationalJournalDay(t, '2026-05-24')).toBe(true)
    expect(inOperationalJournalDay(t, '2026-05-25')).toBe(false)
  })

  it('24.05 21:00 Kyiv (18:00Z) → ещё журнал 24.05', () => {
    const t = new Date('2026-05-24T18:00:00.000Z')
    expect(inOperationalJournalDay(t, '2026-05-24')).toBe(true)
    expect(inOperationalJournalDay(t, '2026-05-25')).toBe(false)
  })

  it('24.05 23:59 Kyiv (20:59Z) → ещё журнал 24.05 (граница в полночь Kyiv)', () => {
    const t = new Date('2026-05-24T20:59:00.000Z')
    expect(inOperationalJournalDay(t, '2026-05-24')).toBe(true)
    expect(inOperationalJournalDay(t, '2026-05-25')).toBe(false)
  })

  it('00:00 Kyiv 25.05 (21:00Z) → журнал 25.05', () => {
    const t = new Date('2026-05-24T21:00:00.000Z')
    expect(inOperationalJournalDay(t, '2026-05-24')).toBe(false)
    expect(inOperationalJournalDay(t, '2026-05-25')).toBe(true)
  })

  it('битая запись: 21:04 записано как UTC (не Kyiv instant) → вне 24.05', () => {
    const wrong = new Date('2026-05-24T21:04:00.000Z')
    expect(inOperationalJournalDay(wrong, '2026-05-24')).toBe(false)
    expect(inOperationalJournalDay(wrong, '2026-05-25')).toBe(true)
  })
})

describe('Сценарии: списки отгрузок (пагинация)', () => {
  it('filter.createdAt=24.05 → bounds 23.05 21:00Z — 24.05 21:00Z', () => {
    const out = transformPaginateOperationalDayCreatedAtFilter({
      filter: { createdAt: '2026-05-24' },
    })
    expect(out.filter?.createdAt).toBe(
      '$gte:2026-05-23T21:00:00.000Z,$lt:2026-05-24T21:00:00.000Z',
    )
    const at2059Kyiv = new Date('2026-05-24T17:59:00.000Z')
    const atMidnightKyiv25 = new Date('2026-05-24T21:00:00.000Z')
    const { startUtc, endUtc } = getCreatedAtUtcBoundsForCalendarDate('2026-05-24')
    expect(at2059Kyiv >= startUtc && at2059Kyiv < endUtc).toBe(true)
    expect(atMidnightKyiv25 >= endUtc).toBe(true)
  })
})

describe('Сценарии: working-hours (поле date)', () => {
  it('normalizeJournalDateParam не сдвигает YYYY-MM-DD', () => {
    expect(normalizeJournalDateParam('2026-05-24')).toBe('2026-05-24')
  })

  it('operational «сегодня» для табеля в 00:30 Kyiv 25.05', () => {
    const simulated = new Date('2026-05-24T21:30:00.000Z')
    expect(getOperationalCalendarDateString(simulated)).toBe('2026-05-25')
  })
})

describe('Сценарии: зарплата смены / кухня', () => {
  it('createdAtOperationalDay совпадает с журналом около полуночи', () => {
    const cut = new Date('2026-05-25T21:30:00.000Z')
    const op = createdAtOperationalDayFromInstant(cut)
    expect(op).toBe('2026-05-26')
    expect(addOneOperationalCalendarDay(op)).toBe('2026-05-27')
  })

  it('полив: dateTimeFrom 24.05 22:00 Kyiv → день 24.05', () => {
    const w = new Date('2026-05-24T19:00:00.000Z')
    expect(createdAtOperationalDayFromInstant(w)).toBe('2026-05-24')
  })
})

describe('Сценарии: волна батча', () => {
  it('вчера operational для закрытия волны', () => {
    const beforeMidnightKyiv = new Date('2026-05-25T20:00:00.000Z')
    expect(getOperationalYesterdayDateString(beforeMidnightKyiv)).toBe(
      '2026-05-24',
    )
  })
})
