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
   *   { count: number; unit: 'years' | 'months' | 'days' } | null,
   *   string?
   * ][]}
   */
  const variations = [
    [
      getDateInYear(thisYear, 0),
      { count: 0, unit: 'days' },
      'current year is always zero',
    ],
    [
      getDateInYear(thisYear - 5, -ms.days(1)),
      { count: 5, unit: 'years' },
      'yesterday 5 years ago makes you 5',
    ],
    [
      getDateInYear(thisYear - 5, 0),
      { count: 5, unit: 'years' },
      'today 5 years ago makes you 5',
    ],
    [
      getDateInYear(thisYear - 5, ms.days(1)),
      { count: 4, unit: 'years' },
      'tomorrow 5 years ago makes you 4',
    ],
    [getDateInYear(thisYear, ms.years(1)), null, 'in the future is also empty'],
    [
      '1950',
      { count: thisYear - 1950, unit: 'years' },
      'assume simple arithmetic if only get a year',
    ],
    [
      `1950-${thisMonthAsString}`,
      { count: thisYear - 1950, unit: 'years' },
      'if we get a month string in the future, adjust accordingly',
    ],
    [
      `1950-${nextMonthAsString}`,
      { count: thisYear - 1950 - 1, unit: 'years' },
    ],
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
   *   expectedResult: {
   *     count: number
   *     unit: 'years' | 'months' | 'days'
   *   } | null
   * ][]}
   */
  const withComparisonDate = [
    ['2024-01-01', '2048-01-01', { count: 24, unit: 'years' }],
    ['2024-02-02', '2034-02-01', { count: 9, unit: 'years' }],
    ['2024-02-02', '2029-01-01', { count: 4, unit: 'years' }],
    ['2024-01-01', '2024-01-02', { count: 1, unit: 'days' }],
    ['2024-01-01', '2024-01-03', { count: 2, unit: 'days' }],
    ['2024-01-01', '2024-01-04', { count: 3, unit: 'days' }],
    ['2024-01-01', '2024-01-05', { count: 4, unit: 'days' }],
    ['2024-01-01', '2024-01-06', { count: 5, unit: 'days' }],
    ['2024-01-01', '2024-01-07', { count: 6, unit: 'days' }],
    ['2024-01-01', '2024-01-08', { count: 7, unit: 'days' }],
    ['2024-01-01', '2024-01-09', { count: 8, unit: 'days' }],
    ['2024-01-01', '2024-01-10', { count: 9, unit: 'days' }],
    ['2024-01-01', '2024-01-11', { count: 10, unit: 'days' }],
    ['2024-01-01', '2024-01-12', { count: 11, unit: 'days' }],
    ['2024-01-01', '2024-01-13', { count: 12, unit: 'days' }],
    ['2024-01-01', '2024-01-14', { count: 13, unit: 'days' }],
    ['2024-01-01', '2024-01-15', { count: 14, unit: 'days' }],
    ['2024-01-01', '2024-01-16', { count: 15, unit: 'days' }],
    ['2024-01-01', '2024-01-17', { count: 16, unit: 'days' }],
    ['2024-01-01', '2024-01-18', { count: 17, unit: 'days' }],
    ['2024-01-01', '2024-01-19', { count: 18, unit: 'days' }],
    ['2024-01-01', '2024-01-20', { count: 19, unit: 'days' }],
    ['2024-01-01', '2024-01-21', { count: 20, unit: 'days' }],
    ['2024-01-01', '2024-01-22', { count: 21, unit: 'days' }],
    ['2024-01-01', '2024-01-23', { count: 22, unit: 'days' }],
    ['2024-01-01', '2024-01-24', { count: 23, unit: 'days' }],
    ['2024-01-01', '2024-01-25', { count: 24, unit: 'days' }],
    ['2024-01-01', '2024-01-26', { count: 25, unit: 'days' }],
    ['2024-01-01', '2024-01-27', { count: 26, unit: 'days' }],
    ['2024-01-01', '2024-01-28', { count: 27, unit: 'days' }],
    // leap day is accounted for also, and still works.
    ['2024-01-01', '2024-01-29', { count: 28, unit: 'days' }],
    ['2024-01-01', '2024-01-30', { count: 29, unit: 'days' }],
    ['2024-01-01', '2024-01-31', { count: 30, unit: 'days' }],
    ['2024-01-01', '2024-02-01', { count: 31, unit: 'days' }],
    ['2024-01-01', '2024-02-02', { count: 32, unit: 'days' }],
    ['2024-01-01', '2024-02-03', { count: 33, unit: 'days' }],
    ['2024-01-01', '2024-02-04', { count: 34, unit: 'days' }],
    ['2024-01-01', '2024-02-05', { count: 35, unit: 'days' }],
    ['2024-01-01', '2024-02-06', { count: 36, unit: 'days' }],
    ['2024-01-01', '2024-02-07', { count: 37, unit: 'days' }],
    ['2024-01-01', '2024-02-08', { count: 38, unit: 'days' }],
    ['2024-01-01', '2024-02-09', { count: 39, unit: 'days' }],
    ['2024-01-01', '2024-02-10', { count: 40, unit: 'days' }],
    ['2024-01-01', '2024-02-11', { count: 41, unit: 'days' }],
    ['2024-01-01', '2024-02-12', { count: 42, unit: 'days' }],
    ['2024-01-01', '2024-02-13', { count: 43, unit: 'days' }],
    ['2024-01-01', '2024-02-14', { count: 44, unit: 'days' }],
    ['2024-01-01', '2024-02-15', { count: 45, unit: 'days' }],
    ['2024-01-01', '2024-02-16', { count: 46, unit: 'days' }],
    ['2024-01-01', '2024-02-17', { count: 47, unit: 'days' }],
    ['2024-01-01', '2024-02-18', { count: 48, unit: 'days' }],
    ['2024-01-01', '2024-02-19', { count: 49, unit: 'days' }],
    ['2024-01-01', '2024-02-20', { count: 50, unit: 'days' }],
    ['2024-01-01', '2024-02-21', { count: 51, unit: 'days' }],
    ['2024-01-01', '2024-02-22', { count: 52, unit: 'days' }],
    ['2024-01-01', '2024-02-23', { count: 53, unit: 'days' }],
    ['2024-01-01', '2024-02-24', { count: 54, unit: 'days' }],
    ['2024-01-01', '2024-02-25', { count: 55, unit: 'days' }],
    ['2024-01-01', '2024-02-26', { count: 56, unit: 'days' }],
    ['2024-01-01', '2024-02-27', { count: 57, unit: 'days' }],
    ['2024-01-01', '2024-02-28', { count: 58, unit: 'days' }],
    ['2024-01-01', '2024-02-29', { count: 59, unit: 'days' }],
    ['2024-01-01', '2024-03-01', { count: 2, unit: 'months' }],
    ['2024-01-01', '2024-03-02', { count: 2, unit: 'months' }],
    ['2024-01-01', '2024-10-01', { count: 9, unit: 'months' }],
    ['2024-01-01', '2025-10-01', { count: 21, unit: 'months' }],
    ['2024-01-01', '2025-12-31', { count: 23, unit: 'months' }],
    ['2024-01-01', '2026-01-01', { count: 2, unit: 'years' }],
    ['1982-09-29', '1982-10-29', { count: 30, unit: 'days' }],

    // weird cases:
    ['2024-02-29', '2024-03-01', { count: 1, unit: 'days' }], // born on leap day
    ['2024-02-29', '2024-04-01', { count: 32, unit: 'days' }], // born on leap day
    ['2024-02-29', '2024-04-01', { count: 32, unit: 'days' }], // born on leap day
    ['2024-02-28', '2024-03-31', { count: 32, unit: 'days' }], // End of February to end of March

    ['2025-01-01', '2024-01-01', null], // Birthdate is in the future
    ['2024-12-31', '2024-01-01', null], // Future date within the same year

    // less precise birthdate
    ['2020', '2024-01-01', { count: 4, unit: 'years' }], // Only year given, should assume Jan 1
    ['2020-06', '2024-01-01', { count: 3, unit: 'years' }], // Only year and month given

    ['2022-01-01', '2024-01-01', { count: 2, unit: 'years' }], // Exactly 2 years
    ['2022-12-01', '2024-10-01', { count: 22, unit: 'months' }], // Close to 24 months but not yet

    ['2024-01-31', '2024-02-28', { count: 28, unit: 'days' }], // End of January to end of February in non-leap year
    ['2024-01-01', '2024-02-28', { count: 58, unit: 'days' }], // One day before the day-to-month switch
    ['2024-01-01', '2024-02-29', { count: 59, unit: 'days' }], // Day of the switch
    ['2024-01-01', '2024-03-01', { count: 2, unit: 'months' }], // One day after the switch
    ['2022-01-01', '2024-01-01', { count: 2, unit: 'years' }], // Exactly 24 months
    ['2022-02-01', '2024-01-31', { count: 23, unit: 'months' }], // One day before switching to years
    ['2022-03', '2024-01-01', { count: 22, unit: 'months' }], // assumes beginning of month for less precise date

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

  t.ok(
    dobToAge('2000-09-02', Date.now()).count > 3,
    'can also take a timestamp'
  )

  t.end()
})
