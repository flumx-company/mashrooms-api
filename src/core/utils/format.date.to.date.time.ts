/** Формат для отображения пользователю везде на клиенте: день.месяц.год (DD.MM.YYYY) */
export const formatDateForClient = (value: Date | string | null): string | null => {
  if (value === null || value === undefined) return null
  const d = typeof value === 'string' ? new Date(value) : value
  if (isNaN(d.getTime())) return null
  const year = d.getUTCFullYear()
  const month = d.getUTCMonth() + 1
  const day = d.getUTCDate()
  const monthString = month < 10 ? `0${month}` : String(month)
  const dayString = day < 10 ? `0${day}` : String(day)
  return `${dayString}.${monthString}.${year}`
}

/** Формат для отображения даты-времени пользователю: день.месяц.год, часы:минуты */
export const formatDateTimeForClient = (value: Date | string | null): string | null => {
  if (value === null || value === undefined) return null
  const d = typeof value === 'string' ? new Date(value) : value
  if (isNaN(d.getTime())) return null
  const datePart = formatDateForClient(d)
  if (!datePart) return null
  const hour = d.getUTCHours()
  const minute = d.getUTCMinutes()
  const h = hour < 10 ? `0${hour}` : String(hour)
  const m = minute < 10 ? `0${minute}` : String(minute)
  return `${datePart}, ${h}:${m}`
}

export const formatDateToDateTime = ({
  value,
  withTime = false,
  dateFrom = true,
  providesHours = false,
  providesMinutes = false,
}: {
  value: Date
  withTime?: boolean
  dateFrom?: boolean
  providesHours?: boolean
  providesMinutes?: boolean
}): string | null | Date => {
  if (typeof value === 'string' || value === null) {
    return value
  }

  const year = value.getUTCFullYear()
  const month = value.getUTCMonth() + 1
  const day = value.getUTCDate()
  const monthString = 10 > month ? `0${month}` : month
  const dayString = 10 > day ? `0${day}` : day

  if (!withTime) {
    return `${year}-${monthString}-${dayString}`
  }

  const hour = providesHours ? value.getUTCHours() : dateFrom ? '00' : '23'
  const minute = providesMinutes ? value.getUTCMinutes() : dateFrom ? '00' : '59'
  const second = dateFrom ? '00' : '59'
  const millisecond = dateFrom ? '000' : '999'

  return `${year}-${monthString}-${dayString} ${hour}:${minute}:${second}:${millisecond}`
}
