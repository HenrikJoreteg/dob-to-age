# dob-to-age

![](https://img.shields.io/npm/dm/dob-to-age.svg)![](https://img.shields.io/npm/v/dob-to-age.svg)![](https://img.shields.io/npm/l/dob-to-age.svg)

A single small function for turning a date of birth string as `YYYY`, `YYYY-MM`, or `YYYY-MM-DD` into an "age" in common terms. This is not a simple mathematical calculation based on the number of milliseconds in a year.

It turns out human logic for "age" is a little weird, this lib tries to match this logic.

For example, if today is April 15, 2021 (`2021-04-15`)

If your birth date is `2000-04-15`, it's your birthday! And regardless of what timezone or time of the day you were born, etc you are considered to be 21 on this day. To get this right, we can't simply use `new Date() - new Date('2000-04-15')` and calculate number of years by dividing whole years.

Instead, human logic says:

- Always assume same time zone.
- Assume if the day matches, you are n + 1 years old regardless of time.

So that's what this lib does. See tests cases for more examples.

## install

```
npm install dob-to-age
```

# usage

```js
import dobToAge from 'dob-to-age'

dobToAge('1982-09-29') // 38 (at time of writing this)
```

# test

```
npm test
```

## Change log

- `1.0.0`: Successfully consumed in both front end and back end packages. Considered stable.
- `0.0.2`: Fix publishing issue.
- `0.0.1`: First public release.

## credits

If you like this follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter.

## license

[MIT](http://mit.joreteg.com/)
