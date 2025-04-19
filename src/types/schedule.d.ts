// schedule.d.ts
export interface Faculty {
  id: string;
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

export type AuditoriumMap = {
  [auditorium: string]: {
    [time: string]: Lesson | null;
  };
};
