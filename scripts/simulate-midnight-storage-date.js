/**
 * Симуляция операционного дня (Europe/Kyiv): резка после полуночи vs холодильник/журнал.
 *
 * Запуск: npm run simulate:midnight-storage-date
 * Своё время: node scripts/simulate-midnight-storage-date.js "2026-05-18T00:24:00+03:00"
 */

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

const BUSINESS_TIMEZONE = process.env.APP_TIMEZONE || 'Europe/Kyiv'

function businessCalendarDay(d) {
  return dayjs(d).tz(BUSINESS_TIMEZONE).format('YYYY-MM-DD')
}

function utcCalendarDayWrong(d) {
  const y = d.getUTCFullYear()
  const m = d.getUTCMonth() + 1
  const day = d.getUTCDate()
  return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function report(label, iso) {
  const simulated = new Date(iso)
  const storageBusiness = businessCalendarDay(simulated)
  const storageUtcBug = utcCalendarDayWrong(simulated)

  console.log(label)
  console.log('  ISO:              ', simulated.toISOString())
  console.log('  Холодильник (OK): ', storageBusiness, '(Europe/Kyiv)')
  console.log(
    '  Старый UTC-баг:   ',
    storageUtcBug,
    storageUtcBug !== storageBusiness ? '  ← вчерашний день' : '',
  )
  console.log('')
}

const customIso = process.argv[2]

console.log(`=== Операционный день: ${BUSINESS_TIMEZONE} ===\n`)

if (customIso) {
  report(`Время: ${customIso}`, customIso)
} else {
  report('00:24 18.05 (Киев)', '2026-05-18T00:24:00+03:00')
  report('00:30 16.05 (Киев)', '2026-05-16T00:30:00+03:00')
  report('14:00 16.05 (Киев)', '2026-05-16T14:00:00+03:00')
}

console.log('Сейчас:')
const now = new Date()
console.log('  Операционный день:  ', businessCalendarDay(now))
console.log('  Старый UTC-день:    ', utcCalendarDayWrong(now))
