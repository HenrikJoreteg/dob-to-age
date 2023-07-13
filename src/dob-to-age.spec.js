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

  /** @type {[string, number, string?][]} */
  const variations = [
    [getDateInYear(thisYear, 0), 0, 'current year is always zero'],
    [
      getDateInYear(thisYear - 5, -ms.days(1)),
      5,
      'yesterday 5 years ago makes you 5',
    ],
    [getDateInYear(thisYear - 5, 0), 5, 'today 5 years ago makes you 5'],
    [
      getDateInYear(thisYear - 5, ms.days(1)),
      4,
      'tomorrow 5 years ago makes you 4',
    ],
    [getDateInYear(thisYear, ms.years(1)), 0, 'in the future is also zero'],
    ['1950', thisYear - 1950, 'assume simple arithmetic if only get a year'],
    [
      `1950-${thisMonthAsString}`,
      thisYear - 1950,
      'if we get a month string in the future, adjust accordingly',
    ],
    [`1950-${nextMonthAsString}`, thisYear - 1950 - 1],
  ]

  variations.forEach(([input, output, description = '']) => {
    t.equal(
      dobToAge(input),
      output,
      `${input} should be ${output}. ${description}`
    )
  })

  t.end()
})
