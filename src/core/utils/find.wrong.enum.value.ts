import { Nullable } from './types'

/**
 * This method is applied only for enums with string values.
 * Adding number type in its return will trigger a bug in some places where it is used.
 */

export const findWrongEnumValue = ({
  $enum,
  value,
}: {
  $enum: object
  value: string | Array<string>
}): Nullable<string> => {
  const enumValueList = Object.values($enum)
  const isArrayValue = Array.isArray(value)

  if (isArrayValue) {
    return value.find((item) => !enumValueList.includes(item))
  }

  return enumValueList.includes(value) ? null : value
}
