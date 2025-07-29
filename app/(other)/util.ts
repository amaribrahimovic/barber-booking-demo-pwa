import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Converts any valid date input to Ljubljana time zone.
 * @param dateInput - A date string, number, Date object, or Dayjs instance
 * @returns Dayjs object in Ljubljana time
 */
export function toLjubljanaTime(
  dateInput: string | number | Date | Dayjs
): Dayjs {
  return dayjs(dateInput).tz("Europe/Ljubljana");
}

export const isNumber = (value: string): boolean => {
  return /^\d+$/.test(value);
};
