export function is_int(x: unknown): x is number {
  return Number.isInteger(x)
}

export function is_obj(x: unknown): x is Object {
  return typeof x === 'object' && !Array.isArray(x) && x !== null
}
