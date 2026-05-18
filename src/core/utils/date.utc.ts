import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const dateOnlyStringToUTCDate = (value: string | Date | null): Date | null => {
  if (!value) return null
  if (value instanceof Date) {
    return new Date(Date.UTC(
      value.getUTCFullYear(),
      value.getUTCMonth(),
      value.getUTCDate()
    ))
  }
  if (typeof value !== 'string') {
    return null
  }
  const datePart = value.slice(0, 10)
  const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) {
    const iso = /Z$|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}Z`
    const d = new Date(iso)
    return isNaN(d.getTime()) ? null : d
  }
  const year = parseInt(match[1], 10)
  const month = parseInt(match[2], 10) - 1
  const day = parseInt(match[3], 10)
  return new Date(Date.UTC(year, month, day))
}

export const ensureUTCDate = (value: string | Date | null): Date | null => {
  if (value == null) return null
  if (value instanceof Date) return value
  const iso = /Z$|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}Z`
  const d = new Date(iso)
  return isNaN(d.getTime()) ? null : d
}

export const addOneDayUTC = (value: string | Date): Date => {
  const d = dateOnlyStringToUTCDate(value) ?? new Date(value)
  return new Date(
    Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate() + 1,
    ),
  )
}

export const getYesterdayUTC = (): Date => {
  const now = new Date()
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - 1,
    ),
  )
}

export const getCurrentYearUTC = (): number => new Date().getUTCFullYear()

/** Календарный день YYYY-MM-DD по UTC. */
export const getUtcCalendarDateString = (now: Date = new Date()): string => {
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth() + 1
  const day = now.getUTCDate()
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export const normalizeUtcCalendarDateString = (
  value?: string | null,
): string | null => {
  if (!value) return null
  const part = value.slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(part) ? part : null
}

/** Границы UTC-календарного дня [00:00Z, 24:00Z) для фильтра createdAt. */
export const getUtcDayBoundsUtc = (
  calendarDate: string,
): { start: Date; endExclusive: Date } => {
  const start = dateOnlyStringToUTCDate(calendarDate.slice(0, 10)) as Date
  return { start, endExclusive: addOneDayUTC(start) }
}

export const getUtcDayStartForCalendarDate = (calendarDate: string): Date => {
  return dateOnlyStringToUTCDate(calendarDate.slice(0, 10)) as Date
}

/** Границы UTC-календарного месяца. */
/** SQL: календарная дата колонки timestamp в UTC (сессия MySQL должна быть UTC). */
export const sqlUtcCalendarDate = (columnRef: string): string =>
  `DATE(${columnRef})`

export const getUtcMonthBoundsUtc = (
  month: string,
): { start: Date; endExclusive: Date } => {
  const [yearStr, monthStr] = month.split('-')
  const year = parseInt(yearStr, 10)
  const m = parseInt(monthStr, 10) - 1
  const start = new Date(Date.UTC(year, m, 1))
  const endExclusive =
    m === 11
      ? new Date(Date.UTC(year + 1, 0, 1))
      : new Date(Date.UTC(year, m + 1, 1))
  return { start, endExclusive }
}
