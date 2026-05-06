import type { Goal, Note, Task, TimeLog, WeekStartDay } from "@/types";

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

const weekStartIndex: Record<WeekStartDay, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export function getWeekStart(date = new Date(), weekStartsOn: WeekStartDay = "monday") {
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);
  const day = current.getDay();
  const targetDay = weekStartIndex[weekStartsOn] ?? weekStartIndex.monday;
  const diff = (day - targetDay + 7) % 7;
  current.setDate(current.getDate() - diff);

  return current.toISOString().slice(0, 10);
}

export function getDaysSince(startDate: string | null | undefined) {
  if (!startDate) {
    return null;
  }

  const start = new Date(`${startDate}T00:00:00`);
  const today = new Date(`${getTodayDate()}T00:00:00`);

  if (Number.isNaN(start.getTime())) {
    return null;
  }

  return Math.max(1, Math.floor((today.getTime() - start.getTime()) / 86_400_000) + 1);
}

export function getActiveTasks(tasks: Task[]) {
  return tasks
    .filter((task) => task.status !== "done")
    .sort((a, b) => {
      if (!a.due_date && !b.due_date) {
        return b.created_at.localeCompare(a.created_at);
      }

      if (!a.due_date) {
        return 1;
      }

      if (!b.due_date) {
        return -1;
      }

      return a.due_date.localeCompare(b.due_date);
    });
}

export function getDueSoonTasks(tasks: Task[]) {
  const today = new Date(`${getTodayDate()}T00:00:00`);

  return tasks
    .filter((task) => {
      if (!task.due_date || task.status === "done") {
        return false;
      }

      const due = new Date(`${task.due_date}T00:00:00`);
      const diffDays = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);

      return diffDays >= 0 && diffDays <= 3;
    })
    .sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""));
}

function getDurationMinutes(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  if (
    !Number.isFinite(startHour) ||
    !Number.isFinite(startMinute) ||
    !Number.isFinite(endHour) ||
    !Number.isFinite(endMinute)
  ) {
    return 0;
  }

  const start = startHour * 60 + startMinute;
  let end = endHour * 60 + endMinute;

  if (end < start) {
    end += 24 * 60;
  }

  return Math.max(0, end - start);
}

export function getWeeklyTimeLogs(timeLogs: TimeLog[], weekStartsOn: WeekStartDay = "monday") {
  const weekStart = getWeekStart(new Date(), weekStartsOn);
  const today = getTodayDate();

  return timeLogs.filter((timeLog) => {
    return timeLog.log_date >= weekStart && timeLog.log_date <= today;
  });
}

export function sumTimeLogHours(timeLogs: TimeLog[], categories: TimeLog["category"][]) {
  const minutes = timeLogs
    .filter((timeLog) => categories.includes(timeLog.category))
    .reduce((total, timeLog) => total + getDurationMinutes(timeLog.start_time, timeLog.end_time), 0);

  return Math.round((minutes / 60) * 10) / 10;
}

export function getAverageGoalProgress(goals: Goal[]) {
  if (goals.length === 0) {
    return null;
  }

  const total = goals.reduce((sum, goal) => sum + goal.progress, 0);

  return Math.round(total / goals.length);
}

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getLatestEmotionNote(notes: Note[]) {
  return notes
    .filter((note) => note.note_type === "emotion")
    .sort((a, b) => {
      const aDate = a.entry_date ?? a.created_at;
      const bDate = b.entry_date ?? b.created_at;

      return bDate.localeCompare(aDate);
    })[0];
}

export function getEmotionSummary(note: Note | undefined) {
  if (!note || !isObject(note.fields)) {
    return null;
  }

  const emotion = note.fields.emotion;
  const intensity = note.fields.intensity;
  const situation = note.fields.situation;

  return {
    emotion: typeof emotion === "string" && emotion ? emotion : "감정 기록",
    intensity:
      typeof intensity === "number" || typeof intensity === "string" ? String(intensity) : null,
    situation: typeof situation === "string" && situation ? situation : null,
  };
}
