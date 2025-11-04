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
  // Expecting YYYY-MM-DD
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
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

