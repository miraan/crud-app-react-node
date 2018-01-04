// @flow

export function dateToString(date: Date): string {
  let day: string = date.getDate().toString()
  let month: string = (date.getMonth() + 1).toString()
  let year: string = date.getFullYear().toString()
  if (day.length < 2) {
    day = '0' + day
  }
  if (month.length < 2) {
    month = '0' + month
  }
  return `${year}-${month}-${day}`
}

function treatAsUTC(date: Date): Date {
  const result = new Date(date)
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset())
  return result
}

export function daysBetween(startDate: Date, endDate: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  return Math.round((treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay)
}

export function daysUntil(date: Date): number {
  return daysBetween(new Date(), date)
}

export function dateByAddingDays(date: Date, days: number): Date {
  const result = new Date(date.valueOf())
  result.setDate(date.getDate() + days)
  return result
}

export function dateByAddingMonths(date: Date, months: number): Date {
  const result = new Date(date.valueOf())
  result.setMonth(date.getMonth() + months)
  return result
}
