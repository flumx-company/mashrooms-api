import { YYYY_MM_DD_REGEX } from './regex'
import { dateOnlyStringToUTCDate } from './date.utc'

export const validateDate = (dateString: string) => {
  // NOTE: Invalid format
  if (!dateString.match(YYYY_MM_DD_REGEX)) {
    return false
  }

  const date = dateOnlyStringToUTCDate(dateString)
  if (!date) return false
  const time = date.getTime()

  // NOTE: NaN value, Invalid date
  if (!time && time !== 0) {
    return false
  }

  return date.toISOString().slice(0, 10) === dateString
}
