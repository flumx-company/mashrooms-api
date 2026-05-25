#!/usr/bin/env node
/**
 * Человекочитаемый прогон сценариев (API + зеркало логики фронта).
 * npm run test:date-scenarios:report
 */
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

const TZ = 'Europe/Kyiv'

// --- API (dist или inline копия date.utc) ---
function getBounds(ymd) {
  const startUtc = dayjs.tz(ymd, TZ).startOf('day').toDate()
  const endUtc = dayjs.tz(ymd, TZ).add(1, 'day').startOf('day').toDate()
  return { startUtc, endUtc }
}

function opDay(d) {
  return dayjs(d).tz(TZ).format('YYYY-MM-DD')
}

function inJournal(createdAt, journalYmd) {
  const { startUtc, endUtc } = getBounds(journalYmd)
  const t = createdAt.getTime()
  return t >= startUtc.getTime() && t < endUtc.getTime()
}

function wageDay(createdAt) {
  return opDay(createdAt)
}

// --- Front mirror (dateUtils) ---
function parseApiTimestampUtc(value) {
  const s = String(value).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s.slice(0, 10)) && !/T|\d{2}:\d{2}/.test(s)) {
    return dayjs.utc(s.slice(0, 10))
  }
  if (/Z$|[+-]\d{2}:?\d{2}$/.test(s)) return dayjs.utc(s)
  const normalized = s.includes('T') ? s : s.replace(' ', 'T')
  return dayjs.utc(normalized)
}

function normalizeJournalDateForAPI(date) {
  if (date == null || date === '') return opDay(new Date())
  const s = String(date).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s.slice(0, 10))) return s.slice(0, 10)
  return parseApiTimestampUtc(s).tz(TZ).format('YYYY-MM-DD')
}

function formatDateTimeForDisplay(iso) {
  return parseApiTimestampUtc(iso).local().format('DD.MM.YYYY HH:mm')
}

const scenarios = [
  {
    name: 'Резка 18.05 00:24 Kyiv → холодильник/журнал 18.05',
    iso: '2026-05-18T00:24:00+03:00',
    check: (d) => ({
      operational: opDay(d),
      journal18: inJournal(d, '2026-05-18'),
      journal17: inJournal(d, '2026-05-17'),
      ok: opDay(d) === '2026-05-18' && inJournal(d, '2026-05-18'),
    }),
  },
  {
    name: 'Резка 16.05 00:30 Kyiv → operational 16.05 (не UTC 15.05)',
    iso: '2026-05-16T00:30:00+03:00',
    check: (d) => {
      const y = d.getUTCFullYear()
      const m = d.getUTCMonth() + 1
      const day = d.getUTCDate()
      const utcDay = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      return {
        operational: opDay(d),
        utcDay,
        ok: opDay(d) === '2026-05-16' && utcDay === '2026-05-15',
      }
    },
  },
  {
    name: 'Отгрузка 24.05 20:59 Kyiv → журнал 24.05',
    iso: '2026-05-24T17:59:00.000Z',
    check: (d) => ({
      journal24: inJournal(d, '2026-05-24'),
      journal25: inJournal(d, '2026-05-25'),
      ok: inJournal(d, '2026-05-24') && !inJournal(d, '2026-05-25'),
    }),
  },
  {
    name: 'Отгрузка 24.05 21:00 Kyiv → ещё 24.05',
    iso: '2026-05-24T18:00:00.000Z',
    check: (d) => ({
      journal24: inJournal(d, '2026-05-24'),
      ok: inJournal(d, '2026-05-24'),
    }),
  },
  {
    name: '00:00 Kyiv 25.05 (21:00Z) → журнал 25.05',
    iso: '2026-05-24T21:00:00.000Z',
    check: (d) => ({
      journal24: inJournal(d, '2026-05-24'),
      journal25: inJournal(d, '2026-05-25'),
      ok: !inJournal(d, '2026-05-24') && inJournal(d, '2026-05-25'),
    }),
  },
  {
    name: 'Отгрузка 24.05 21:00 Kyiv — при правильной модели ещё 24.05 (не баг 21:00)',
    iso: '2026-05-24T18:00:00.000Z',
    check: (d) => ({
      journal24: inJournal(d, '2026-05-24'),
      ok: inJournal(d, '2026-05-24'),
    }),
  },
  {
    name: 'Битая БД: 21:04 как UTC → не в журнале 24.05',
    iso: '2026-05-24T21:04:00.000Z',
    check: (d) => ({
      journal24: inJournal(d, '2026-05-24'),
      journal25: inJournal(d, '2026-05-25'),
      ok: !inJournal(d, '2026-05-24') && inJournal(d, '2026-05-25'),
    }),
  },
  {
    name: 'Зарплата: резка 26.05 00:30 Kyiv → день 26.05',
    iso: '2026-05-25T21:30:00.000Z',
    check: (d) => ({
      wageDay: wageDay(d),
      journal26: inJournal(d, '2026-05-26'),
      ok: wageDay(d) === '2026-05-26',
    }),
  },
  {
    name: 'Фронт: normalizeJournalDate("2026-05-24") → 2026-05-24',
    iso: null,
    check: () => ({
      out: normalizeJournalDateForAPI('2026-05-24'),
      ok: normalizeJournalDateForAPI('2026-05-24') === '2026-05-24',
    }),
  },
  {
    name: 'Фронт: display API "2026-05-24T18:00:00.000Z" (локаль процесса)',
    iso: '2026-05-24T18:00:00.000Z',
    check: (d) => {
      const display = formatDateTimeForDisplay(d.toISOString())
      return { display, ok: display.length > 0 }
    },
  },
]

let passed = 0
let failed = 0

console.log('\n=== Date scenarios (Mashrooms) ===\n')

for (const s of scenarios) {
  const d = s.iso ? new Date(s.iso) : new Date()
  const result = s.check(d)
  const ok = result.ok
  if (ok) passed++
  else failed++

  console.log(`${ok ? '✓' : '✗'} ${s.name}`)
  if (s.iso) console.log(`    ISO: ${d.toISOString()}`)
  Object.keys(result)
    .filter((k) => k !== 'ok')
    .forEach((k) => console.log(`    ${k}: ${JSON.stringify(result[k])}`))
  console.log('')
}

console.log(`Итого: ${passed} passed, ${failed} failed\n`)
process.exit(failed > 0 ? 1 : 0)
