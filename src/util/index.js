export * from './string'
export * from './proxy'
export * from './storage'

export function now() {
  return new Date()
}

export function nextWeek() {
  return new Date().getTime() + 7 * 24 * 60 * 60 * 1000
}
