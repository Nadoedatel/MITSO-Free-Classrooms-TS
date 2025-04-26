import type { AllLesson } from "./allLesson";

export interface Schedule {
   [ dateTime: string]:{
    [ numberAuditorium: string ]: AllLesson | null;
   }
  }