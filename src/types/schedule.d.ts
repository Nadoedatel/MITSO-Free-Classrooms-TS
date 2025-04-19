// schedule.d.ts
export interface Faculty {
  name: string;
}

export interface EducationForm {
  id: string;
  name: string;
  faculty?: Faculty;
}

export interface Course {
  id: string;
  name: string;
  form?: EducationForm;
}

export interface Group {
  id: string;
  name: string;
  course?: Course;
}

export interface Lesson {
  id: string;
  date: string;
  auditorium: string;
  time: string;
  group_class: string | Group;
  subject: string;
}

interface ScheduleResponse {
    [week: string]: {
      [date: string]: Lesson[];
    };
  }

export type AuditoriumMap = {
  [auditorium: string]: {
    [time: string]: Lesson | null;
  };
};

export interface ScheduleCache {
  allLessons: Lesson[];
  initialized: boolean;
}

export type CorpusConfig = {
  auditoriumsInNewCorpus: string[];
  auditoriumsInOldCorpus: string[];
  auditoriumsInDormitory: string[];
};

export type TimeSlot = 
  | "08.00-9.25" 
  | "09.35-11.00" 
  | "11.10-12.35" 
  | "13.05-14.30" 
  | "14.40-16.05" 
  | "16.35-18.00" 
  | "18.10-19.35" 
  | "19.45-21.10";