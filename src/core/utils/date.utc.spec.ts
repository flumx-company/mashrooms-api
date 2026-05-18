import {
  getUtcCalendarDateString,
  getUtcDayBoundsUtc,
} from './date.utc'

describe('UTC calendar (midnight cutting)', () => {
  const clientIso = '2026-05-18T00:24:00+03:00'
  const simulated = new Date(clientIso)

  it('at 00:24 Kyiv UTC calendar day is 17.05', () => {
    expect(getUtcCalendarDateString(simulated)).toBe('2026-05-17')
  })

  it('UTC day bounds for 17.05 include 00:24 Kyiv instant', () => {
    const { start, endExclusive } = getUtcDayBoundsUtc('2026-05-17')
    expect(simulated >= start).toBe(true)
    expect(simulated < endExclusive).toBe(true)
  })

  it('UTC day bounds for 18.05 exclude 00:24 Kyiv instant', () => {
    const { start, endExclusive } = getUtcDayBoundsUtc('2026-05-18')
    expect(simulated >= start && simulated < endExclusive).toBe(false)
  })
})
