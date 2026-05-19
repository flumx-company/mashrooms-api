import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'

import { getUtcCalendarDateString, getUtcDayStart } from './date.utc'

dayjs.extend(utc)

/** Как журнал резки на фронте при ошибке: локальный календарный день. */
function localJournalCalendarDay(iso: string): string {
  return dayjs(iso).format('YYYY-MM-DD')
}

/** Как журнал резки должен слать в API: UTC-календарный день. */
function utcJournalCalendarDay(iso: string): string {
  return dayjs.utc(iso).format('YYYY-MM-DD')
}

describe('UTC calendar date (storage & cutting API)', () => {
  const clientIso = '2026-05-16T00:30:00+03:00'
  const simulated = new Date(clientIso)

  it('at 00:30 Kyiv UTC day is 15.05 for storage and UTC journal API', () => {
    const storageDate = getUtcCalendarDateString(simulated)
    const journalUtc = utcJournalCalendarDay(clientIso)
    const journalLocal = localJournalCalendarDay(clientIso)

    expect(storageDate).toBe('2026-05-15')
    expect(journalUtc).toBe('2026-05-15')
    expect(journalLocal).toBe('2026-05-16')
    expect(storageDate).toBe(journalUtc)
    expect(storageDate).not.toBe(journalLocal)
  })

  it('UTC day start matches instant for 00:30 Kyiv scenario', () => {
    expect(getUtcDayStart(simulated).toISOString()).toBe(
      '2026-05-15T00:00:00.000Z',
    )
  })

  it('during daytime UTC journal and storage day match', () => {
    const noon = new Date('2026-05-16T14:00:00+03:00')
    const iso = '2026-05-16T14:00:00+03:00'

    expect(getUtcCalendarDateString(noon)).toBe('2026-05-16')
    expect(utcJournalCalendarDay(iso)).toBe('2026-05-16')
  })
})
