export function jsonArrayIncludes(value: unknown, target: string | number | bigint): boolean {
  return Array.isArray(value) && value.some((entry) => String(entry) === String(target));
}

export function jsonArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}
