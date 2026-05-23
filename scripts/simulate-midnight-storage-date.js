/**
 * Симуляция: операционный день (Europe/Kyiv) vs UTC.
 *
 * Запуск: npm run simulate:midnight-storage-date
 * Своё время: node scripts/simulate-midnight-storage-date.js "2026-05-18T00:24:00+03:00"
 */

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

const TZ = 'Europe/Kyiv'

function operationalCalendarDay(d) {
  return dayjs(d).tz(TZ).format('YYYY-MM-DD')
}

function utcCalendarDay(d) {
  const y = d.getUTCFullYear()
  const m = d.getUTCMonth() + 1
  const day = d.getUTCDate()
  return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function localJournalDay(iso) {
  return dayjs(iso).format('YYYY-MM-DD')
}

function report(label, iso) {
  const simulated = new Date(iso)
  const storage = operationalCalendarDay(simulated)
  const storageUtc = utcCalendarDay(simulated)
  const journalLocal = localJournalDay(iso)

  console.log(label)
  console.log('  ISO:              ', simulated.toISOString())
  console.log('  Холодильник (Kyiv):', storage, '  ← целевая модель')
  console.log('  Холодильник (UTC): ', storageUtc, storageUtc !== storage ? '  ← старая модель' : '')
  console.log(
    '  Журнал (локально): ',
    journalLocal,
    journalLocal === storage ? '  ← OK' : '  ← расхождение',
  )
  console.log('')
}

const customIso = process.argv[2]

console.log('=== Операционный день Europe/Kyiv (резка + холодильник) ===\n')

if (customIso) {
  report(`Время: ${customIso}`, customIso)
} else {
  report('Клиент: 16.05.2026 00:30 (Киев)', '2026-05-16T00:30:00+03:00')
  report('Нарезка: 18.05.2026 00:24 (Киев)', '2026-05-18T00:24:00+03:00')
  report('Днём: 16.05.2026 14:00 (Киев)', '2026-05-16T14:00:00+03:00')
}

console.log('Сейчас:')
const now = new Date()
console.log('  Операционный день:  ', operationalCalendarDay(now))
console.log('  UTC день (старое):  ', utcCalendarDay(now))
