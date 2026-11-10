import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'

import {
  getCreatedAtUtcBoundsForCalendarDate,
  getOperationalCalendarDateString,
  getOperationalDayStartUtc,
  getUtcBoundsForCalendarDate,
  getUtcCalendarDateString,
  getUtcMonthBounds,
  OPERATIONAL_TIMEZONE,
  transformPaginateOperationalDayCreatedAtFilter,
} from './date.utc'

dayjs.extend(utc)
dayjs.extend(timezone)

describe('getCreatedAtUtcBoundsForCalendarDate (dayjs, Europe/Kyiv)', () => {
  it('maps calendar date to [startUtc, endUtc) like Luxon', () => {
    const date = '2026-05-23'
    const { startUtc, endUtc } = getCreatedAtUtcBoundsForCalendarDate(date)

    expect(startUtc.toISOString()).toBe('2026-05-22T21:00:00.000Z')
    expect(endUtc.toISOString()).toBe('2026-05-23T21:00:00.000Z')
  })

  it('includes instant inside the day and excludes next midnight Kyiv', () => {
    const { startUtc, endUtc } =
      getCreatedAtUtcBoundsForCalendarDate('2026-05-18')
    const cut = new Date('2026-05-18T00:24:00+03:00')
    const nextDayKyiv = new Date('2026-05-19T00:00:00+03:00')

    expect(cut.getTime()).toBeGreaterThanOrEqual(startUtc.getTime())
    expect(cut.getTime()).toBeLessThan(endUtc.getTime())
    expect(nextDayKyiv.getTime()).toBeGreaterThanOrEqual(endUtc.getTime())
  })

  it('at 00:30 Kyiv operational label is 16.05 not UTC 15.05', () => {
    const simulated = new Date('2026-05-16T00:30:00+03:00')
    expect(getOperationalCalendarDateString(simulated)).toBe('2026-05-16')
    expect(getUtcCalendarDateString(simulated)).toBe('2026-05-15')
  })

  it('operational day start equals startUtc of that calendar date', () => {
    const simulated = new Date('2026-05-16T00:30:00+03:00')
    const ymd = dayjs(simulated).tz(OPERATIONAL_TIMEZONE).format('YYYY-MM-DD')
    expect(getOperationalDayStartUtc(simulated).toISOString()).toBe(
      getCreatedAtUtcBoundsForCalendarDate(ymd).startUtc.toISOString(),
    )
  })

  it('21:00 Kyiv on 24.05 stays in journal filter for 24.05', () => {
    const { startUtc, endUtc } = getCreatedAtUtcBoundsForCalendarDate('2026-05-24')
    const at2100Kyiv = new Date('2026-05-24T18:00:00.000Z')
    expect(at2100Kyiv.getTime()).toBeGreaterThanOrEqual(startUtc.getTime())
    expect(at2100Kyiv.getTime()).toBeLessThan(endUtc.getTime())
  })

  it('wall-clock 21:00 written as UTC misses 24.05 journal (client DB edit case)', () => {
    const { endUtc } = getCreatedAtUtcBoundsForCalendarDate('2026-05-24')
    const wrongWallClockUtc = new Date('2026-05-24T21:00:00.000Z')
    expect(wrongWallClockUtc.getTime()).toBeGreaterThanOrEqual(endUtc.getTime())
  })

  it('uses the winter UTC+2 boundary after the autumn clock change', () => {
    const { startUtc, endUtc } =
      getCreatedAtUtcBoundsForCalendarDate('2026-11-10')
    expect(startUtc.toISOString()).toBe('2026-11-09T22:00:00.000Z')
    expect(endUtc.toISOString()).toBe('2026-11-10T22:00:00.000Z')
  })

  it('keeps the 25-hour local day during the autumn DST transition', () => {
    const { startUtc, endUtc } =
      getCreatedAtUtcBoundsForCalendarDate('2026-10-25')
    expect(startUtc.toISOString()).toBe('2026-10-24T21:00:00.000Z')
    expect(endUtc.toISOString()).toBe('2026-10-25T22:00:00.000Z')
  })
})

describe('getUtcBoundsForCalendarDate', () => {
  it('does not apply any server or operational timezone offset', () => {
    const { startUtc, endUtc } = getUtcBoundsForCalendarDate('2026-11-10')
    expect(startUtc.toISOString()).toBe('2026-11-10T00:00:00.000Z')
    expect(endUtc.toISOString()).toBe('2026-11-11T00:00:00.000Z')
  })

  it('creates UTC month bounds without a DST-dependent offset', () => {
    const { startUtc, endUtc } = getUtcMonthBounds('2026-11')
    expect(startUtc.toISOString()).toBe('2026-11-01T00:00:00.000Z')
    expect(endUtc.toISOString()).toBe('2026-12-01T00:00:00.000Z')
  })
})

describe('transformPaginateOperationalDayCreatedAtFilter', () => {
  it('rewrites filter.createdAt to UTC bounds for operational day', () => {
    const out = transformPaginateOperationalDayCreatedAtFilter({
      filter: { createdAt: '2026-05-24' },
    })
    expect(out.filter?.createdAt).toContain('$gte:')
    expect(out.filter?.createdAt).toContain('$lt:')
    expect(out.filter?.createdAt).toContain('2026-05-23T21:00:00.000Z')
    expect(out.filter?.createdAt).toContain('2026-05-24T21:00:00.000Z')
  })
})
