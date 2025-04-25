import type { Lesson } from "./lesson";

export interface AllLesson extends Lesson{
  fak?: string;
  form?: string;
  id?: string;
  kaf?: string;
  kurse?: string;
  priority?: null;
  status?: string;
  teacher?: string;
}
