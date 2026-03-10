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
  const isoMatch = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10)
    const month = parseInt(isoMatch[2], 10) - 1
    const day = parseInt(isoMatch[3], 10)
    return new Date(Date.UTC(year, month, day))
  }
  // Формат клиента: день.месяц.год (DD.MM.YYYY) или DD/MM/YYYY
  const dmyMatch = value.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/)
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10)
    const month = parseInt(dmyMatch[2], 10) - 1
    const year = parseInt(dmyMatch[3], 10)
    return new Date(Date.UTC(year, month, day))
  }
  // Fallback: attempt ISO parse; if missing Z, append Z
  const iso = /Z$|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}Z`
  const d = new Date(iso)
  return isNaN(d.getTime()) ? null : d
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

