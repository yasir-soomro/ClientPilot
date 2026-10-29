export function isCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (year < 100) {
    date.setUTCFullYear(year);
  }

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function parseRecord<T>(
  payload: unknown,
  label: string,
  isValid: (value: unknown) => value is T,
): T {
  if (!isValid(payload)) {
    throw new Error(`The server returned an invalid ${label} response.`);
  }
  return payload;
}

export function parseList<T>(
  payload: unknown,
  label: string,
  isValid: (value: unknown) => value is T,
): T[] {
  if (!Array.isArray(payload)) {
    throw new Error(`The server returned an invalid ${label} list.`);
  }

  return payload.map((item) => parseRecord(item, label, isValid));
}
