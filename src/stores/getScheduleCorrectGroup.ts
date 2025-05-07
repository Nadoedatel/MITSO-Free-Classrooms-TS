import type { AllLesson } from "@/types/allLesson";
import type { Course } from "@/types/course";
import type { Faculty } from "@/types/faculty";
import type { Form } from "@/types/form";
import type { Group } from "@/types/group";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useScheduleCorrectStore = defineStore("scheduleCorrect", () => {
  const allInfoSchedule = ref<AllLesson>([]);
  const correctFaculty = ref<Faculty | null>(null);
  const correctForm = ref<Form | null>(null);
  const correctCourse = ref<Course | null>(null);
  const correctGroup = ref<Group | null>(null);

  const setScheduleData = (data: AllLesson) => {
    allInfoSchedule.value = data;
  };

  const setForm = (form: Form) => {
    correctForm.value = form;
  };

  const setCourse = (course: Course) => {
    correctCourse.value = course;
  };

  const setGroup = (group: Group) => {
    correctGroup.value = group;
  };

  return {
    allInfoSchedule,
    correctFaculty,
    correctForm,
    correctCourse,
    correctGroup,
    setScheduleData,
    setForm,
    setCourse,
    setGroup,
  };
});
