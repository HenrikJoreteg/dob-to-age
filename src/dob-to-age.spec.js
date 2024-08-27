import test from 'tape'
import dobToAge from './dob-to-age'
import ms from 'milliseconds'

test('dobToAge', t => {
  const padTwo = num => (num + '').padStart(2, '0')
  const toDateString = date =>
    [
      date.getFullYear(),
      padTwo(date.getMonth() + 1),
      padTwo(date.getDate()),
    ].join('-')

  /**
   * @param {number} year
   * @param {number} adjustment Adjustment from "now" in that year in milliseconds
   * @returns {string}
   */
  const getDateInYear = (year, adjustment) => {
    const date = new Date()
    date.setFullYear(year)
    return toDateString(new Date(date.valueOf() + adjustment))
  }

  const thisYear = new Date().getFullYear()
  const thisMonthAsString = (new Date().getMonth() + 1 + '').padStart(2, '0')
  const nextMonthAsString = (new Date().getMonth() + 2 + '').padStart(2, '0')

  /**
   * @type {[
   *   string,
   *   { years?: number; months?: number; days?: number },
   *   string?
   * ][]}
   */
  const variations = [
    [getDateInYear(thisYear, 0), { days: 0 }, 'current year is always zero'],
    [
      getDateInYear(thisYear - 5, -ms.days(1)),
      { years: 5 },
      'yesterday 5 years ago makes you 5',
    ],
    [
      getDateInYear(thisYear - 5, 0),
      { years: 5 },
      'today 5 years ago makes you 5',
    ],
    [
      getDateInYear(thisYear - 5, ms.days(1)),
      { years: 4 },
      'tomorrow 5 years ago makes you 4',
    ],
    [getDateInYear(thisYear, ms.years(1)), null, 'in the future is also empty'],
    [
      '1950',
      { years: thisYear - 1950 },
      'assume simple arithmetic if only get a year',
    ],
    [
      `1950-${thisMonthAsString}`,
      { years: thisYear - 1950 },
      'if we get a month string in the future, adjust accordingly',
    ],
    [`1950-${nextMonthAsString}`, { years: thisYear - 1950 - 1 }],
  ]

  variations.forEach(([input, output, description = '']) => {
    t.deepEqual(
      dobToAge(input),
      output,
      `${input} should be ${JSON.stringify(output)}. ${description}`
    )
  })

  /**
   * @type {[
   *   inputDate: string,
   *   comparisonDate: string,
   *   expectedResult: { years?: number; months?: number; days?: number }
   * ][]}
   */
  const withComparisonDate = [
    ['2024-01-01', '2048-01-01', { years: 24 }],
    ['2024-02-02', '2034-02-01', { years: 9 }],
    ['2024-02-02', '2029-01-01', { years: 4 }],
    ['2024-01-01', '2024-01-02', { days: 1 }],
    ['2024-01-01', '2024-01-03', { days: 2 }],
    ['2024-01-01', '2024-01-04', { days: 3 }],
    ['2024-01-01', '2024-01-05', { days: 4 }],
    ['2024-01-01', '2024-01-06', { days: 5 }],
    ['2024-01-01', '2024-01-07', { days: 6 }],
    ['2024-01-01', '2024-01-08', { days: 7 }],
    ['2024-01-01', '2024-01-09', { days: 8 }],
    ['2024-01-01', '2024-01-10', { days: 9 }],
    ['2024-01-01', '2024-01-11', { days: 10 }],
    ['2024-01-01', '2024-01-12', { days: 11 }],
    ['2024-01-01', '2024-01-13', { days: 12 }],
    ['2024-01-01', '2024-01-14', { days: 13 }],
    ['2024-01-01', '2024-01-15', { days: 14 }],
    ['2024-01-01', '2024-01-16', { days: 15 }],
    ['2024-01-01', '2024-01-17', { days: 16 }],
    ['2024-01-01', '2024-01-18', { days: 17 }],
    ['2024-01-01', '2024-01-19', { days: 18 }],
    ['2024-01-01', '2024-01-20', { days: 19 }],
    ['2024-01-01', '2024-01-21', { days: 20 }],
    ['2024-01-01', '2024-01-22', { days: 21 }],
    ['2024-01-01', '2024-01-23', { days: 22 }],
    ['2024-01-01', '2024-01-24', { days: 23 }],
    ['2024-01-01', '2024-01-25', { days: 24 }],
    ['2024-01-01', '2024-01-26', { days: 25 }],
    ['2024-01-01', '2024-01-27', { days: 26 }],
    ['2024-01-01', '2024-01-28', { days: 27 }],
    // leap day is accounted for also, and still works.
    ['2024-01-01', '2024-01-29', { days: 28 }],
    ['2024-01-01', '2024-01-30', { days: 29 }],
    ['2024-01-01', '2024-01-31', { days: 30 }],
    ['2024-01-01', '2024-02-01', { days: 31 }],
    ['2024-01-01', '2024-02-02', { days: 32 }],
    ['2024-01-01', '2024-02-03', { days: 33 }],
    ['2024-01-01', '2024-02-04', { days: 34 }],
    ['2024-01-01', '2024-02-05', { days: 35 }],
    ['2024-01-01', '2024-02-06', { days: 36 }],
    ['2024-01-01', '2024-02-07', { days: 37 }],
    ['2024-01-01', '2024-02-08', { days: 38 }],
    ['2024-01-01', '2024-02-09', { days: 39 }],
    ['2024-01-01', '2024-02-10', { days: 40 }],
    ['2024-01-01', '2024-02-11', { days: 41 }],
    ['2024-01-01', '2024-02-12', { days: 42 }],
    ['2024-01-01', '2024-02-13', { days: 43 }],
    ['2024-01-01', '2024-02-14', { days: 44 }],
    ['2024-01-01', '2024-02-15', { days: 45 }],
    ['2024-01-01', '2024-02-16', { days: 46 }],
    ['2024-01-01', '2024-02-17', { days: 47 }],
    ['2024-01-01', '2024-02-18', { days: 48 }],
    ['2024-01-01', '2024-02-19', { days: 49 }],
    ['2024-01-01', '2024-02-20', { days: 50 }],
    ['2024-01-01', '2024-02-21', { days: 51 }],
    ['2024-01-01', '2024-02-22', { days: 52 }],
    ['2024-01-01', '2024-02-23', { days: 53 }],
    ['2024-01-01', '2024-02-24', { days: 54 }],
    ['2024-01-01', '2024-02-25', { days: 55 }],
    ['2024-01-01', '2024-02-26', { days: 56 }],
    ['2024-01-01', '2024-02-27', { days: 57 }],
    ['2024-01-01', '2024-02-28', { days: 58 }],
    ['2024-01-01', '2024-02-29', { days: 59 }],
    ['2024-01-01', '2024-03-01', { months: 2 }],
    ['2024-01-01', '2024-03-02', { months: 2 }],
    ['2024-01-01', '2024-10-01', { months: 9 }],
    ['2024-01-01', '2025-10-01', { months: 21 }],
    ['2024-01-01', '2025-12-31', { months: 23 }],
    ['2024-01-01', '2026-01-01', { years: 2 }],
    ['1982-09-29', '1982-10-29', { days: 30 }],

    // weird cases:
    ['2024-02-29', '2024-03-01', { days: 1 }], // born on leap day
    ['2024-02-29', '2024-04-01', { days: 32 }], // born on leap day
    ['2024-02-29', '2024-04-01', { days: 32 }], // born on leap day
    ['2024-02-28', '2024-03-31', { days: 32 }], // End of February to end of March

    ['2025-01-01', '2024-01-01', null], // Birthdate is in the future
    ['2024-12-31', '2024-01-01', null], // Future date within the same year

    // less precise birthdate
    ['2020', '2024-01-01', { years: 4 }], // Only year given, should assume Jan 1
    ['2020-06', '2024-01-01', { years: 3 }], // Only year and month given

    ['2022-01-01', '2024-01-01', { years: 2 }], // Exactly 2 years
    ['2022-12-01', '2024-10-01', { months: 22 }], // Close to 24 months but not yet

    ['2024-01-31', '2024-02-28', { days: 28 }], // End of January to end of February in non-leap year
    ['2024-01-01', '2024-02-28', { days: 58 }], // One day before the day-to-month switch
    ['2024-01-01', '2024-02-29', { days: 59 }], // Day of the switch
    ['2024-01-01', '2024-03-01', { months: 2 }], // One day after the switch
    ['2022-01-01', '2024-01-01', { years: 2 }], // Exactly 24 months
    ['2022-02-01', '2024-01-31', { months: 23 }], // One day before switching to years
    ['2022-03', '2024-01-01', { months: 22 }], // assumes beginning of month for less precise date

    ['Invalid Date', '2024-01-01', null], // Invalid date format
    ['20222', '2024-01-01', null], // Invalid date format
    ['2022-', '2024-01-01', null], // Invalid date format
    ['2022-3', '2024-01-01', null], // Invalid date format
    ['abcd', '2024-01-01', null], // Completely non-numeric input
    ['2024-13-01', '2024-01-01', null], // Invalid month
    ['2024-01-32', '2024-01-01', null], // Invalid day

    [null, '2024-01-01', null], // Null input
  ]

  const stringToLocalDate = string => {
    const parts = string.split('-').map(Number)
    return new Date(parts[0], parts[1] - 1, parts[2])
  }

  withComparisonDate.forEach(([input, comparisonDate, output]) => {
    t.deepEqual(
      dobToAge(input, stringToLocalDate(comparisonDate)),
      output,
      `${input} should be ${JSON.stringify(
        output
      )} when compared to ${comparisonDate}`
    )
  })

  t.end()
})
