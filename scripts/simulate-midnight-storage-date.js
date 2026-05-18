/**
 * Симуляция: UTC-календарь для storage.date и фильтров резки.
 *
 * npm run simulate:midnight-storage-date
 * node scripts/simulate-midnight-storage-date.js "2026-05-18T00:24:00+03:00"
 */

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

function utcCalendarDay(iso) {
  return dayjs(iso).utc().format('YYYY-MM-DD')
}

function localCalendarDay(iso) {
  return dayjs(iso).format('YYYY-MM-DD')
}

function report(label, iso) {
  const simulated = new Date(iso)
  const utcDay = utcCalendarDay(iso)
  const localDay = localCalendarDay(iso)

  console.log(label)
  console.log('  ISO:           ', simulated.toISOString())
  console.log('  UTC-день (API):', utcDay)
  console.log('  Локальный день (UI):', localDay)
  if (utcDay !== localDay) {
    console.log('  → в холодильнике date=UTC; в UI показываем локальный день из updatedAt')
  }
  console.log('')
}

const customIso = process.argv[2]

console.log('=== Все даты на беке — UTC; в UI — локальный пояс браузера ===\n')

if (customIso) {
  report(`Время: ${customIso}`, customIso)
} else {
  report('Клиент 18.05.2026 00:24 (Киев)', '2026-05-18T00:24:00+03:00')
  report('Клиент 16.05.2026 00:30 (Киев)', '2026-05-16T00:30:00+03:00')
}
