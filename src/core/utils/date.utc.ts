import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

/** Операционный часовой пояс (рабочие сутки на ферме). */
export const OPERATIONAL_TIMEZONE = 'Europe/Kyiv'

export const dateOnlyStringToUTCDate = (value: string | Date | null): Date | null => {
  if (!value) return null
  if (value instanceof Date) {
    // If already a Date, extract UTC components and create new UTC date
    return new Date(Date.UTC(
      value.getUTCFullYear(),
      value.getUTCMonth(),
      value.getUTCDate()
    ))
  }
  if (typeof value !== 'string') {
    return null
  }
  // YYYY-MM-DD или строка с временем (YYYY-MM-DD HH:mm:...); для колонки date берём только дату
  const datePart = value.slice(0, 10)
  const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) {
    // Fallback: attempt ISO parse; if missing Z, append Z
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
  // Try ISO first; if no zone provided, assume UTC
  const iso = /Z$|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}Z`
  const d = new Date(iso)
  return isNaN(d.getTime()) ? null : d
}

/** Следующий календарный день в UTC (00:00 UTC). */
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

/** Вчера 00:00 UTC. */
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

/** Текущий год по UTC (для имён батчей и т.п.). */
export const getCurrentYearUTC = (): number => new Date().getUTCFullYear()

/** Календарная дата YYYY-MM-DD по UTC (для автологики на беке). */
export const getUtcCalendarDateString = (now: Date = new Date()): string => {
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth() + 1
  const day = now.getUTCDate()
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** Начало текущих UTC-суток (instant для сравнения с updatedAt). */
export const getUtcDayStart = (now: Date = new Date()): Date => {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )
}

/** Календарный операционный день YYYY-MM-DD (Europe/Kyiv). */
export const getOperationalCalendarDateString = (
  now: Date = new Date(),
  tz: string = OPERATIONAL_TIMEZONE,
): string => dayjs(now).tz(tz).format('YYYY-MM-DD')

/**
 * Календарная дата YYYY-MM-DD в поясе tz → полуинтервал [startUtc, endUtc) для createdAt в БД (UTC).
 * Аналог Luxon: fromISO(date, { zone }).startOf('day').toUTC() … plus({ days: 1 }).
 */
export const getCreatedAtUtcBoundsForCalendarDate = (
  dateYmd: string,
  tz: string = OPERATIONAL_TIMEZONE,
): { startUtc: Date; endUtc: Date } => {
  const normalized = dateYmd.slice(0, 10)
  const startUtc = dayjs.tz(normalized, tz).startOf('day').toDate()
  const endUtc = dayjs.tz(normalized, tz).add(1, 'day').startOf('day').toDate()
  return { startUtc, endUtc }
}

/** YYYY-MM-DD для query-параметра журнала (без сдвига TZ). */
export const normalizeJournalDateParam = (date: string): string => {
  const part = date.trim().slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(part)) {
    throw new Error(`Invalid journal date: ${date}`)
  }
  return part
}

/** @deprecated используйте getCreatedAtUtcBoundsForCalendarDate */
export const getOperationalDayBoundsFromDateString = (
  dateYmd: string,
  tz: string = OPERATIONAL_TIMEZONE,
): { startUtc: Date; endUtc: Date } =>
  getCreatedAtUtcBoundsForCalendarDate(dateYmd, tz)

/** Операционный день из UTC instant (для группировки зарплаты и т.п.). */
export const createdAtOperationalDayFromInstant = (
  value: Date | string,
  tz: string = OPERATIONAL_TIMEZONE,
): string => getOperationalCalendarDateString(new Date(value), tz)

/** Следующий календарный операционный день YYYY-MM-DD (Europe/Kyiv). */
export const addOneOperationalCalendarDay = (
  dateYmd: string,
  tz: string = OPERATIONAL_TIMEZONE,
): string => dayjs.tz(dateYmd.slice(0, 10), tz).add(1, 'day').format('YYYY-MM-DD')

/** Вчерашний операционный день YYYY-MM-DD (Europe/Kyiv). */
export const getOperationalYesterdayDateString = (
  now: Date = new Date(),
  tz: string = OPERATIONAL_TIMEZONE,
): string =>
  dayjs(now).tz(tz).subtract(1, 'day').format('YYYY-MM-DD')

/**
 * nestjs-paginate: filter.createdAt=$ilike:YYYY-MM-DD → $gte/$lt по операционным суткам.
 */
export const transformPaginateOperationalDayCreatedAtFilter = <
  T extends { filter?: Record<string, string | string[]> },
>(
  query: T,
): T => {
  const raw = query.filter?.createdAt
  if (raw == null || raw === '') {
    return query
  }
  const match = String(Array.isArray(raw) ? raw[0] : raw).match(/(\d{4}-\d{2}-\d{2})/)
  if (!match) {
    return query
  }
  const ymd = normalizeJournalDateParam(match[1])
  const { startUtc, endUtc } = getCreatedAtUtcBoundsForCalendarDate(ymd)
  const { createdAt: _drop, ...restFilter } = query.filter
  return {
    ...query,
    filter: {
      ...restFilter,
      createdAt: `$gte:${startUtc.toISOString()},$lt:${endUtc.toISOString()}`,
    },
  }
}

/** Начало календарных суток dateYmd в tz как instant UTC (00:00). */
export const getOperationalDayStartUtc = (
  now: Date = new Date(),
  tz: string = OPERATIONAL_TIMEZONE,
): Date => {
  const dateYmd = dayjs(now).tz(tz).format('YYYY-MM-DD')
  return getCreatedAtUtcBoundsForCalendarDate(dateYmd, tz).startUtc
}

/** Месяц YYYY-MM в поясе tz → [startUtc, endUtc) для фильтра createdAt. */
export const getOperationalMonthBoundsUtc = (
  monthYmd: string,
  tz: string = OPERATIONAL_TIMEZONE,
): { startUtc: Date; endUtc: Date } => {
  const startUtc = dayjs.tz(`${monthYmd}-01`, tz).startOf('day').toDate()
  const endUtc = dayjs
    .tz(`${monthYmd}-01`, tz)
    .add(1, 'month')
    .startOf('day')
    .toDate()
  return { startUtc, endUtc }
}

