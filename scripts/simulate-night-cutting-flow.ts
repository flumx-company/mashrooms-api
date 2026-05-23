/**
 * Полная симуляция ночной резки: холодильник + журнал + фронт.
 *
 * npm run simulate:night-cutting
 * npm run simulate:night-cutting -- "2026-05-18T00:24:00+03:00"
 */

import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'

import {
  BUSINESS_TIMEZONE,
  getBusinessDayUtcRange,
  getUtcCalendarDateString,
  getUtcDayStart,
} from '../src/core/utils/date.utc'

dayjs.extend(utc)
dayjs.extend(timezone)

const TZ = 'Europe/Kyiv'

/** Как на фронте после фикса (dateUtils.formatUtcDateForAPI) */
function frontBusinessDay(now: Date): string {
  return dayjs(now).tz(TZ).format('YYYY-MM-DD')
}

/** Как на фронте: день из createdAt для календаря журнала */
function frontDayFromApiTimestamp(createdAtIso: string): string {
  return dayjs.utc(createdAtIso).tz(TZ).format('YYYY-MM-DD')
}

/** Старый баг: UTC-день на беке/фронте */
function legacyUtcDay(now: Date): string {
  const y = now.getUTCFullYear()
  const m = now.getUTCMonth() + 1
  const d = now.getUTCDate()
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/** Старый баг: журнал LIKE 'YYYY-MM-DD%' */
function legacyJournalMatches(cuttingCreatedAt: Date, routeDate: string): boolean {
  return cuttingCreatedAt.toISOString().startsWith(routeDate)
}

function inBusinessDayRange(cuttingAt: Date, routeDate: string): boolean {
  const { start, end } = getBusinessDayUtcRange(routeDate)
  return cuttingAt >= start && cuttingAt < end
}

function pad(s: string, w: number) {
  return s.padEnd(w)
}

function runScenario(label: string, isoLocal: string) {
  const cuttingAt = new Date(isoLocal)
  const createdAtDb = cuttingAt.toISOString()

  const storageDate = getUtcCalendarDateString(cuttingAt)
  const journalDayFront = frontDayFromApiTimestamp(createdAtDb)
  const userClicksDay = frontBusinessDay(cuttingAt)

  const legacyStorage = legacyUtcDay(cuttingAt)
  const legacyJournalDay = dayjs.utc(createdAtDb).format('YYYY-MM-DD')

  const journalOk = inBusinessDayRange(cuttingAt, userClicksDay)
  const legacyJournalOk = legacyJournalMatches(cuttingAt, userClicksDay)

  const w = 22
  console.log('\n' + '═'.repeat(72))
  console.log(label)
  console.log('═'.repeat(72))
  console.log(pad('Момент (локально)', w), isoLocal)
  console.log(pad('createdAt в БД (UTC)', w), createdAtDb)
  console.log('')
  console.log('── После фикса (Europe/Kyiv) ──')
  console.log(pad('Дата в холодильник', w), storageDate, storageDate === userClicksDay ? '✓' : '✗')
  console.log(pad('День в календаре журнала', w), journalDayFront, journalDayFront === userClicksDay ? '✓' : '✗')
  console.log(pad('Пользователь открывает день', w), userClicksDay)
  console.log(
    pad('API найдёт резку (диапазон)', w),
    journalOk ? 'да ✓' : 'нет ✗',
    `  [${getBusinessDayUtcRange(userClicksDay).start.toISOString()} .. ${getBusinessDayUtcRange(userClicksDay).end.toISOString()})`,
  )
  console.log(pad('Начало операц. суток', w), getUtcDayStart(cuttingAt).toISOString())
  console.log('')
  console.log('── Старый баг (UTC-день + LIKE) ──')
  console.log(pad('Дата в холодильник', w), legacyStorage, legacyStorage !== userClicksDay ? '← вчера' : '')
  console.log(pad('День в календаре', w), legacyJournalDay, legacyJournalDay !== userClicksDay ? '← вчера' : '')
  console.log(
    pad('API LIKE нашёл бы', w),
    legacyJournalOk ? 'да' : 'нет ✗ (резка есть, журнал пустой)',
  )
}

const custom = process.argv[2]

console.log(`Операционный пояс: ${BUSINESS_TIMEZONE}`)
console.log('Симуляция: нарезка после полуночи по Киеву\n')

if (custom) {
  runScenario(`Своё время: ${custom}`, custom)
} else {
  runScenario(
    'Кейс клиента: нарезка 00:24 18.05.2026 (Киев)',
    '2026-05-18T00:24:00+03:00',
  )
  runScenario(
    'Граница: 00:00 18.05.2026 (Киев)',
    '2026-05-18T00:00:00+03:00',
  )
  runScenario(
    'Граница: 23:59 17.05.2026 (Киев)',
    '2026-05-17T23:59:00+03:00',
  )
  runScenario(
    'Днём: 14:00 18.05.2026 (Киев)',
    '2026-05-18T14:00:00+03:00',
  )
}

console.log('\n')
