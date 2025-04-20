import type { Lesson } from "./lesson"

export interface Auditorium {
   [ numberAuditorium: string]:{
    [ timeSlot: string ]: Lesson | null;
   }
  }