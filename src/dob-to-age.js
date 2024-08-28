/**
 * Extracts the local date string from a date object.
 *
 * If we get an arbitrary "local" date object from the browser, for say "new
 * Date()" then the year, month, date, will all be in local time. But by turning
 * it into a string we can then compare it to another timezone-less string like
 * the dobString and get a consistent result.
 *
 * @param {Date} date
 * @returns {string} As YYYY-MM-DD
 */
const extractLocalDateString = date =>
  [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map(num => num.toString().padStart(2, '0'))
    .join('-')

/**
 * A strange things happens in JS date constructor when you pass a string with
 * the format 'YYYY-MM-DD'. It will create a date with the correct year, month,
 * and day, but the time will be set to midnight in UTC.
 *
 * @param {string} dateString In format YYYY-MM-DD
 * @returns {Date}
 */
export const dateStringToDate = dateString => new Date(dateString)

// if more than 59 days, switch to months
const MAX_DAYS = 59
// if we're at 24 months we always do years.
const MAX_MONTHS = 23
// ms in a day
const MS_IN_DAY = 1000 * 60 * 60 * 24

const acceptedDobRegex = /^\d{4}(-\d{2}){0,2}$/
/**
 * Calculates age in years, months, or days based on a date of birth string.
 *
 * @param {string} dobString - The date of birth string in format YYYY or
 *   YYYY-MM or YYYY-MM-DD.
 * @param {{
 *   referenceDate?: Date | number
 *   forcedCalendarUnit?: 'years' | 'months' | 'days'
 * }} [options]
 * @returns {{ count: number; unit: 'years' | 'months' | 'days' } | null} - An
 *   object containing the count and unit of age, or null if the input is invalid.
 */
export default (dobString, { referenceDate, forcedCalendarUnit } = {}) => {
  if (typeof dobString !== 'string' || !acceptedDobRegex.test(dobString)) {
    return null
  }
  const dobParts = dobString.split('-')
  if (dobParts.length === 1) {
    dobString = `${dobString}-01-01`
  } else if (dobParts.length === 2) {
    dobString = `${dobString}-01`
  }

  if (typeof referenceDate === 'number') {
    referenceDate = new Date(referenceDate)
  }
  const currentDateString = extractLocalDateString(referenceDate || new Date())

  /**
   * Normalize dates to avoid timezone differences. These will both be forced to
   * be UTC because of how new Date() works in JS. If you don't have any time
   * elements of a date string it will default to midnight UTC. This is a known
   * quirky behavior of JS dates:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
   *
   *
   * But by converting both to UTC by first extracing "local" year/month/date
   * and turning it into a string we can end up with two UTC dates we can safely
   * compare them.
   */
  const currentDate = new Date(currentDateString)
  const birthDate = new Date(dobString)

  /** Make sure we have two real dates */
  if (isNaN(currentDate.valueOf())) {
    return null
  }
  if (isNaN(birthDate.valueOf())) {
    return null
  }

  /**
   * Calculate the raw # of days difference first. Flooring the resulting value
   * ensures that we end up with zero indexing. Which is what we want because
   * that's how we think about age in days. You're 0 days old on your birth day.
   *
   * This is the only part of the logic that uses the raw date values.
   * Everything else is using our weird human logic for this type of thing.
   */
  const daysDifference = Math.floor(
    (currentDate.valueOf() - birthDate.valueOf()) / MS_IN_DAY
  )

  /**
   * If the days difference is negative, we know the birth date is in the future
   * so we treat this like other error conditions.
   */
  if (daysDifference < 0) {
    return null
  }

  /**
   * If the days difference is less than the max days we return the days. But we
   * never return a negative number of days.
   */
  if (
    forcedCalendarUnit === 'days' ||
    (!forcedCalendarUnit && daysDifference <= MAX_DAYS)
  ) {
    return { count: daysDifference, unit: 'days' }
  }

  /**
   * Now turn everything into numbers so we can do normal math without needing
   * to do worry about timezones, etc.
   */
  const [currentYear, currentMonth, currentDay] = currentDateString
    .split('-')
    .map(Number)
  const [birthYear, birthMonth, birthDay] = dobString.split('-').map(Number)

  /** Calculate the number of months old */
  let monthsOld = (currentYear - birthYear) * 12 + (currentMonth - birthMonth)

  /** If the current day is less than the birth day, we need to subtract a month */
  if (currentDay < birthDay) {
    monthsOld--
  }

  /** If we're over 23 months we show the values in years . */
  if (
    forcedCalendarUnit === 'years' ||
    (!forcedCalendarUnit && monthsOld > MAX_MONTHS)
  ) {
    return { count: Math.floor(monthsOld / 12), unit: 'years' }
  }

  /**
   * If we're not forcing units, we should never return < 2 months. This helps
   * the rollover from 59 days to 2 months for scenarios where the calendar
   * month would otherwise put us at one month. It would tick from 59 days to 1
   * month which seems quite broken. So we force it to 2 months, but only in the
   * case where we're not forcing it to a specific unit.
   */
  if (!forcedCalendarUnit && monthsOld < 2) {
    return { count: 2, unit: 'months' }
  }

  /** If not, we return the unedited months. */
  return { count: monthsOld, unit: 'months' }
}
