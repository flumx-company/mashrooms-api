export const formatDateToDateTime = ({
  value,
  withTime = false,
}: {
  value: Date
  withTime?: boolean
}): string => {
  if (typeof value === 'string') {
    return value
  }

  const year = value.getFullYear()
  const month = value.getMonth() + 1
  const day = value.getDate()
  const hour = value.getHours()
  const minute = value.getMinutes()
  const second = value.getSeconds()

  if (withTime) {
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  return `${year}-${month}-${day}`
}
