import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'

import {
  BUSINESS_TIMEZONE,
  getBusinessDayUtcRange,
  getUtcCalendarDateString,
  getUtcDayStart,
} from './date.utc'

dayjs.extend(utc)
dayjs.extend(timezone)

describe('Business calendar date (Europe/Kyiv)', () => {
  const clientIso = '2026-05-18T00:24:00+03:00'
  const simulated = new Date(clientIso)

  it('at 00:24 Kyiv storage and journal day is 18.05', () => {
    const storageDate = getUtcCalendarDateString(simulated)
    const journalDay = dayjs(simulated).tz(BUSINESS_TIMEZONE).format('YYYY-MM-DD')

    expect(storageDate).toBe('2026-05-18')
    expect(journalDay).toBe('2026-05-18')
    expect(storageDate).toBe(journalDay)
  })

  it('business day start for 18.05 Kyiv is 17.05 21:00 UTC (summer)', () => {
    const { start } = getBusinessDayUtcRange('2026-05-18')
    expect(start.toISOString()).toBe('2026-05-17T21:00:00.000Z')
    expect(getUtcDayStart(simulated).toISOString()).toBe(
      '2026-05-17T21:00:00.000Z',
    )
  })

  it('cutting at 00:24 Kyiv falls into 18.05 day range', () => {
    const { start, end } = getBusinessDayUtcRange('2026-05-18')
    expect(simulated >= start && simulated < end).toBe(true)
  })

  it('during daytime Kyiv day matches calendar', () => {
    const noon = new Date('2026-05-16T14:00:00+03:00')
    expect(getUtcCalendarDateString(noon)).toBe('2026-05-16')
  })
})
