import type { Json, Note, NoteInsert, NoteType, NoteUpdate } from "@/types";
import { getNoteTypeConfig } from "./config";

export type NoteFormValues = {
  note_type: NoteType;
  title: string;
  content: string;
  entry_date: string;
  tags: string;
  fields: Record<string, string>;
};

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function stringifyTags(tags: string[]) {
  return tags.join(", ");
}

export function getJsonRecord(value: Json): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce<Record<string, string>>((result, [key, entry]) => {
    if (entry === null || entry === undefined) {
      result[key] = "";
      return result;
    }

    result[key] = String(entry);
    return result;
  }, {});
}

export function getInitialNoteFormValues(note?: Note): NoteFormValues {
  return {
    note_type: note?.note_type ?? "company",
    title: note?.title ?? "",
    content: note?.content ?? "",
    entry_date: note?.entry_date ?? getTodayDate(),
    tags: note ? stringifyTags(note.tags) : "",
    fields: note ? getJsonRecord(note.fields) : {},
  };
}

export function buildNoteInsert(values: NoteFormValues): Omit<NoteInsert, "user_id"> {
  return {
    note_type: values.note_type,
    title: values.title,
    content: values.content,
    entry_date: values.entry_date || null,
    tags: parseTags(values.tags),
    fields: buildFields(values),
  };
}

export function buildNoteUpdate(values: NoteFormValues): NoteUpdate {
  return {
    note_type: values.note_type,
    title: values.title,
    content: values.content,
    entry_date: values.entry_date || null,
    tags: parseTags(values.tags),
    fields: buildFields(values),
  };
}

function buildFields(values: NoteFormValues): Record<string, string | number | null> {
  const config = getNoteTypeConfig(values.note_type);

  return config.fields.reduce<Record<string, string | number | null>>((result, field) => {
    const rawValue = values.fields[field.name]?.trim() ?? "";

    if (!rawValue) {
      result[field.name] = null;
      return result;
    }

    result[field.name] = field.kind === "number" ? Number(rawValue) : rawValue;
    return result;
  }, {});
}
