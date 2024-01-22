export const formatDateToDateTime = (value: Date): string => {
  const year = value.getFullYear()
  const month = value.getMonth() + 1
  const day = value.getDate()
  const hour = value.getHours()
  const minute = value.getMinutes()
  const second = value.getSeconds()

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
