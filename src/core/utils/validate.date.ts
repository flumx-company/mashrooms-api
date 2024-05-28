import { YYYY_MM_DD_REGEX } from './regex'

export const validateDate = (dateString: string) => {
  // NOTE: Invalid format
  if (!dateString.match(YYYY_MM_DD_REGEX)) {
    return false
  }

  const date = new Date(dateString)
  const time = date.getTime()

  // NOTE: NaN value, Invalid date
  if (!time && time !== 0) {
    return false
  }

  return date.toISOString().slice(0, 10) === dateString
}
