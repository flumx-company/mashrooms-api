export const formatDateToDateTime = ({
  value,
  withTime = false,
  dateFrom = true,
}: {
  value: Date
  withTime?: boolean
  dateFrom?: boolean
}): string | null | Date => {
  if (typeof value === 'string' || value === null) {
    return value
  }

  const year = value.getFullYear()
  const month = value.getMonth() + 1
  const day = value.getDate()

  if (!withTime) {
    return `${year}-${month}-${day}`
  }

  const hour = dateFrom ? '00' : '23'
  const minute = dateFrom ? '00' : '59'
  const second = dateFrom ? '00' : '59'
  const millisecond = dateFrom ? '000' : '999'

  return `${year}-${month}-${day} ${hour}:${minute}:${second}:${millisecond}`
}
