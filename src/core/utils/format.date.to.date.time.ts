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
