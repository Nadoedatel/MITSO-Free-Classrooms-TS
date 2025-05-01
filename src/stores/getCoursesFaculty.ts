import { useFormFaculty } from "@/stores/getFormFaculty";
import type { Course } from "@/types/course";
import type { Faculty } from "@/types/faculty";
import type { Form } from "@/types/form";
import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";

export const useCoursesFaculty = defineStore("coursesFaculty", () => {
  const formFacultyStore = useFormFaculty();
  const nowForm = ref<Form | null>(null);
  const arrCourses = ref<Course[]>([]);

  const { arrForm } = storeToRefs(formFacultyStore);

  // Функция установки текущей формы обучения
  function setCurrentForm(form?: Form): void {
    if (form) {
      nowForm.value = form;
    } else if (arrForm.value.length > 0) {
      nowForm.value = arrForm.value[0];
    }
  }

  return {
    getCourseFaculty,
    setCurrentForm,
    nowForm,
    arrCourses,
  };
});
