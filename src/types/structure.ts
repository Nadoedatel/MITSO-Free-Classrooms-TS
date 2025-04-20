import type { Course } from "./course";
import type { Faculty } from "./faculty";
import type { Form } from "./form";
import type { Group } from "./group";

export type CompleteStructureItem = {
    faculty: Faculty;
    form: Form;
    courses: {
      course: Course;
      groups: Group[];
    }[];
  };
  