import { Transform } from 'class-transformer'

export const ToBoolean = () => {
  const toPlain = Transform(
    ({ value }) => {
      return value
    },
    {
      toPlainOnly: true,
    },
  )
  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj }) => {
        return transformToBoolean(obj[key])
      },
      {
        toClassOnly: true,
      },
    )(target, key)
  }
  return function (target: any, key: string) {
    toPlain(target, key)
    toClass(target, key)
  }
}

const transformToBoolean = (value: any) => {
  if (value === null || value === undefined) {
    return undefined
  }
  if (typeof value === 'boolean') {
    return value
  }
  if (['true', 'on', '1'].includes(value.toLowerCase())) {
    return true
  }
  if (['false', 'off', '0'].includes(value.toLowerCase())) {
    return false
  }
  return undefined
}
