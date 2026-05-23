import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

/** Операционный пояс (ночная смена, холодильник, журнал резки). */
export const BUSINESS_TIMEZONE = process.env.APP_TIMEZONE ?? 'Europe/Kyiv'

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

/** Следующий календарный день в операционном поясе (00:00). */
export const addOneDayUTC = (value: string | Date): Date => {
  const d = dateOnlyStringToUTCDate(value) ?? new Date(value)
  const next = dayjs(d).tz(BUSINESS_TIMEZONE).add(1, 'day').startOf('day')
  return next.utc().toDate()
}

/** Вчера 00:00 в операционном поясе. */
export const getYesterdayUTC = (): Date => {
  return dayjs().tz(BUSINESS_TIMEZONE).subtract(1, 'day').startOf('day').utc().toDate()
}

/** Текущий год в операционном поясе (имена батчей). */
export const getCurrentYearUTC = (): number =>
  dayjs().tz(BUSINESS_TIMEZONE).year()

/** Календарная дата YYYY-MM-DD в операционном поясе (холодильник, резка). */
export const getUtcCalendarDateString = (now: Date = new Date()): string => {
  return dayjs(now).tz(BUSINESS_TIMEZONE).format('YYYY-MM-DD')
}

/** Начало текущих операционных суток (instant UTC для сравнения с updatedAt). */
export const getUtcDayStart = (now: Date = new Date()): Date => {
  return dayjs(now).tz(BUSINESS_TIMEZONE).startOf('day').utc().toDate()
}

/** [start, end) — операционные сутки YYYY-MM-DD в UTC instant. */
export const getBusinessDayUtcRange = (
  dateStr: string,
): { start: Date; end: Date } => {
  const day = dateStr.slice(0, 10)
  const start = dayjs.tz(day, BUSINESS_TIMEZONE).startOf('day')
  return {
    start: start.utc().toDate(),
    end: start.add(1, 'day').utc().toDate(),
  }
}

/** [start, end) — календарный месяц YYYY-MM в операционном поясе. */
export const getBusinessMonthUtcRange = (
  month: string,
): { start: Date; end: Date } => {
  const start = dayjs.tz(`${month}-01`, BUSINESS_TIMEZONE).startOf('month')
  return {
    start: start.utc().toDate(),
    end: start.add(1, 'month').utc().toDate(),
  }
}
