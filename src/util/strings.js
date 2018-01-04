// @flow

export function stripForwardSlashes(value: string): string {
  return value.replace(/\//g, '')
}

export function truncateString(str: string, length: number, ending: ?string): string {
  if (length == null) {
    length = 100
  }
  if (ending == null) {
    ending = '...'
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending
  } else {
    return str
  }
}
