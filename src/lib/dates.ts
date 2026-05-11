const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export type KstCalendarDay = {
  key: string;
  dayOfMonth: number;
  isToday: boolean;
};

export type KstWeekDay = KstCalendarDay & {
  label: string;
};

export const kstWeekdayLabels = ["월", "화", "수", "목", "금", "토", "일"];

export function toKstDateString(date: Date | string = new Date()) {
  const value = typeof date === "string" ? new Date(date) : date;

  return new Date(value.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

export function getKstTodayString() {
  return toKstDateString(new Date());
}

export function getKstDateParts(date: Date | string = new Date()) {
  const [year, month, day] = toKstDateString(date).split("-").map(Number);

  return { year, month, day };
}

export function getKstMonthCalendarDays(date: Date | string = new Date()): KstCalendarDay[] {
  const { year, month } = getKstDateParts(date);
  const todayKey = getKstTodayString();
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const lastDayOfMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const leadingEmptyDays = (firstDay.getUTCDay() + 6) % 7;
  const days: KstCalendarDay[] = Array.from({ length: leadingEmptyDays }, () => ({
    key: "",
    dayOfMonth: 0,
    isToday: false,
  }));

  for (let day = 1; day <= lastDayOfMonth; day += 1) {
    const key = formatDateOnly(year, month, day);

    days.push({
      key,
      dayOfMonth: day,
      isToday: key === todayKey,
    });
  }

  return days;
}

export function getKstWeekRange(date: Date | string = new Date()) {
  const { year, month, day } = getKstDateParts(date);
  const todayKey = getKstTodayString();
  const anchor = new Date(Date.UTC(year, month - 1, day));
  const diffToMonday = (anchor.getUTCDay() + 6) % 7;
  const monday = new Date(anchor);
  monday.setUTCDate(anchor.getUTCDate() - diffToMonday);

  const days: KstWeekDay[] = kstWeekdayLabels.map((label, index) => {
    const current = new Date(monday);
    current.setUTCDate(monday.getUTCDate() + index);
    const key = formatDateOnly(current.getUTCFullYear(), current.getUTCMonth() + 1, current.getUTCDate());

    return {
      label,
      key,
      dayOfMonth: current.getUTCDate(),
      isToday: key === todayKey,
    };
  });

  return {
    start: days[0],
    end: days[days.length - 1],
    days,
  };
}

function formatDateOnly(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
