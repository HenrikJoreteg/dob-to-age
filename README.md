# dob-to-age

![](https://img.shields.io/npm/dm/dob-to-age.svg)![](https://img.shields.io/npm/v/dob-to-age.svg)![](https://img.shields.io/npm/l/dob-to-age.svg)

A single small function for turning a date of birth string as `YYYY`, `YYYY-MM`, or `YYYY-MM-DD` into an "age" in common terms. This is not a simple mathematical calculation based on the number of milliseconds in a year.

It turns out human logic for "age" is a little weird, this lib tries to match this logic.

For example, if today is April 15, 2021 (`2021-04-15`)

If your birth date is `2000-04-15`, it's your birthday! And regardless of what timezone or time of the day you were born, etc you are considered to be 21 on this day. To get this right, we can't simply use `new Date() - new Date('2000-04-15')` and calculate number of years by dividing whole years.

Instead, human logic says:

- Always assume same time zone.
- Assume if the day matches, you are n + 1 years old regardless of time.

Additionally, in medical settings it's semi-standard to counts days up until 59 days, then switch to months. Then return values in months up until 23 months, after that it returns years.

This library matches that (somewhat screwy) logic.

It _always_ returns an object.

The object will have only one of either:

If result should be shown in years:

`{years: 2}`

If result should be shown in months:

`{months: 21}`

If result should be shown in days (because we're under 2 months):

`{days: 18}`

## install

```
npm install dob-to-age
```

# usage

```js
import dobToAge from 'dob-to-age'

dobToAge('1982-09-29') // {years: 38} (at time of writing this)
// can pass a reference date object
dobToAge('1982-09-29', new Date('1982-10-29')) // {months: 1}
```

# test

```
npm test
```

## Change log

- `2.0.0`: New implementation, returns object of either years, months, or days per semi-standard accepted medical nomenclature. Counts days up until 59 days, then switches to 2 months. Returns values in months until 23 months, then returns years. Ignores timezones, etc. Just returns age in the (somewhat illogical) way we do it as humans.
- `1.0.0`: Successfully consumed in both front end and back end packages. Considered stable.
- `0.0.2`: Fix publishing issue.
- `0.0.1`: First public release.

## credits

If you like this follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter.

## license

[MIT](http://mit.joreteg.com/)
