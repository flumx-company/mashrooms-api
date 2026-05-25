# Даты и время (Mashrooms)

## Правило

| Тип | В MySQL | Фильтр на API | На фронте |
|-----|---------|---------------|-----------|
| **Момент** (`createdAt`, `dateTimeFrom`, …) | UTC instant | `getCreatedAtUtcBoundsForCalendarDate(YYYY-MM-DD)` → `>= startUtc AND < endUtc` | `parseApiTimestampUtc` → `formatDateTimeForDisplay` (локаль браузера) |
| **Операционный день** (журнал резки, отгрузки по дню) | — | Параметр `YYYY-MM-DD` без сдвига TZ (`normalizeJournalDateParam`) | `normalizeJournalDateForAPI` |
| **Колонка `date`** (work-record, storage, yield, price) | `DATE` как метка дня | `workRecord.date = :date` | `formatDateForDisplay` (без сдвига) |

Операционный часовой пояс: **`Europe/Kyiv`**.

## Инфраструктура

- Node: `process.env.TZ = 'UTC'` (`src/main.ts`)
- MySQL: `time_zone = '+00:00'` (compose + `initSql` в datasource)
- TypeORM: `timezone: 'Z'`

## Утилиты (API)

`src/core/utils/date.utc.ts`:

- `getCreatedAtUtcBoundsForCalendarDate` — границы суток Kyiv в UTC
- `getOperationalCalendarDateString` — «сегодня» на ферме
- `createdAtOperationalDayFromInstant` — день из UTC instant (зарплата, цены)
- `transformPaginateOperationalDayCreatedAtFilter` — `filter.createdAt` в list API

## Утилиты (фронт)

`packages/workers/utils-worker/dateUtils.ts`:

- `normalizeJournalDateForAPI` — дата в query для журналов
- `formatOperationalDateForAPI` — сегодня Kyiv для форм
- `parseApiTimestampUtc` / `formatDateTimeForDisplay` — отображение моментов
- `operationalCalendarDayFromApi` — день Kyiv из ответа API

## Где применено

- Резка: journal, storage.date, create `createdAt` explicit UTC
- Отгрузки / offload-records: пагинация и `findAllByDate`
- Смены: расчёт зарплаты по операционному дню
- Work records: дефолт `date` = operational today

## Частые ошибки

1. **ILIKE по `createdAt`** — не использовать; только bounds.
2. **`DATE(createdAt)` в UTC** — неверно около полуночи Kyiv; группировать через `getOperationalCalendarDateString`.
3. **MySQL `+03:00`** при app `Z` — в колонке «киевское» время; перезапуск БД после смены TZ.
