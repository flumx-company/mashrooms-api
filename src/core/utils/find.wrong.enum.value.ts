import { Nullable } from './types'

export const findWrongEnumValue = ({
  $enum,
  value,
}: {
  $enum: object
  value: string | Array<string | number>
}): Nullable<string | number> => {
  const enumValueList = Object.values($enum)
  const isArrayValue = Array.isArray(value)

  if (isArrayValue) {
    return value.find((item) => !enumValueList.includes(item))
  }

  return enumValueList.includes(value) ? null : value
}
