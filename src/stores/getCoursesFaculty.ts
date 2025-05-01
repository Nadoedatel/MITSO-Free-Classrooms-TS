import type { Course } from "@/types/course";
import type { Form } from "@/types/form";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCoursesFaculty = defineStore("coursesFaculty", () => {
  const nowForm = ref<Form | null>(null);
  const arrCourses = ref<Course[]>([]);

  const setCourses = (courses: Course[]) => {
    arrCourses.value = courses;
  };

  const setCurrentForm = (form?: Form): void => {
    nowForm.value = form || null;
  };

  return { 
    nowForm,
    arrCourses,
    setCourses,
    setCurrentForm
  };
});
