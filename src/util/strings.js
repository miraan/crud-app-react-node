// @flow

export function stripForwardSlashes(value: string): string {
  return value.replace(/\//g, '')
}
