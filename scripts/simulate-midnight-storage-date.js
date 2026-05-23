/**
 * Симуляция: чистый UTC на беке vs локальный день на фронте (источник бага).
 *
 * Запуск: npm run simulate:midnight-storage-date
 * Своё время: node scripts/simulate-midnight-storage-date.js "2026-05-16T00:30:00+03:00"
 */

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

function utcCalendarDay(d) {
  const y = d.getUTCFullYear()
  const m = d.getUTCMonth() + 1
  const day = d.getUTCDate()
  return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function localJournalDay(iso) {
  return dayjs(iso).format('YYYY-MM-DD')
}

function utcJournalDay(iso) {
  return dayjs.utc(iso).format('YYYY-MM-DD')
}

function report(label, iso) {
  const simulated = new Date(iso)
  const storage = utcCalendarDay(simulated)
  const journalLocal = localJournalDay(iso)
  const journalUtc = utcJournalDay(iso)

  console.log(label)
  console.log('  ISO:           ', simulated.toISOString())
  console.log('  Холодильник:   ', storage, '(бек UTC)')
  console.log(
    '  Журнал LOCAL:  ',
    journalLocal,
    journalLocal !== storage ? '  ← БАГ (старый фронт)' : '  ← OK',
  )
  console.log(
    '  Журнал UTC:    ',
    journalUtc,
    journalUtc !== storage ? '  ← несовпадение' : '  ← OK (целевая модель)',
  )
  console.log('')
}

const customIso = process.argv[2]

console.log('=== UTC на беке: холодильник + журнал (API) ===\n')

if (customIso) {
  report(`Время: ${customIso}`, customIso)
} else {
  report('Клиент: 16.05.2026 00:30 (Киев)', '2026-05-16T00:30:00+03:00')
  report('Днём: 16.05.2026 14:00 (Киев)', '2026-05-16T14:00:00+03:00')
}

console.log('Сейчас:')
const now = new Date()
console.log('  UTC день (бек):     ', utcCalendarDay(now))
console.log('  Журнал LOCAL:       ', localJournalDay(now.toISOString()))
console.log('  Журнал UTC (фикс):  ', utcJournalDay(now.toISOString()))
