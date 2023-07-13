/**
 * @param {Date} date
 * @returns {string} As YYYY-MM-DD
 */
const dateToString = date =>
  [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
  ].join('-')

/**
 * @param {string} dobString In format YYYY or YYYY-MM or YYYY-MM-DD
 * @returns {number} Number of years old
 */
export default dobString => {
  const now = new Date()
  const currentYear = now.getFullYear()
  // by creating both dates using the same mechanism
  // we can safely compare them without worrying about
  // timezones, etc.
  const todayDate = new Date(dateToString(now))
  const birthDate = new Date(dobString)

  // grabbing the number of years
  const yearsOld = currentYear - birthDate.getFullYear()

  // now we modify birthday to be same year as today
  // so we can do a simple comparison to see if the
  // day has occurred yet
  birthDate.setFullYear(currentYear)

  return Math.max(birthDate > todayDate ? yearsOld - 1 : yearsOld, 0)
}
