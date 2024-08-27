/**
 * @param {Date} date
 * @returns {string} As YYYY-MM-DD
 */
const dateToString = date => date.toISOString().slice(0, 10)

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
 * @param {Date} [referenceDate] - The reference date to calculate age from
 *   (usually the current date).
 * @returns {{ years?: number; months?: number; days?: number }} - An object
 *   containing the number of years, months, or days.
 */
export default (dobString, referenceDate) => {
  if (typeof dobString !== 'string' || !acceptedDobRegex.test(dobString)) {
    return {}
  }
  const dobParts = dobString.split('-')
  if (dobParts.length === 1) {
    dobString = `${dobString}-01-01`
  } else if (dobParts.length === 2) {
    dobString = `${dobString}-01`
  }

  const currentDateString = dateToString(referenceDate || new Date())

  /** Normalize dates to avoid timezone differences */
  const currentDate = new Date(currentDateString)
  const birthDate = new Date(dobString)

  /** Make sure we have two real dates */
  if (isNaN(currentDate.valueOf())) {
    return {}
  }
  if (isNaN(birthDate.valueOf())) {
    return {}
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
    return {}
  }

  /**
   * If the days difference is less than the max days we return the days. But we
   * never return a negative number of days.
   */
  if (daysDifference <= MAX_DAYS) {
    return { days: daysDifference }
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

  /** If we're over 23 months we always show the values in years. */
  if (monthsOld > MAX_MONTHS) {
    return { years: Math.floor(monthsOld / 12) }
  }

  //  If not, we return the months.
  return { months: monthsOld }
}
