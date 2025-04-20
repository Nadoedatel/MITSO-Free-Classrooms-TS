import { useFormFaculty } from "@/stores/getFormFaculty";
import type { Course } from "@/types/course";
import type { Faculty } from "@/types/faculty";
import type { Form } from "@/types/form";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCoursesFaculty = defineStore("coursesFaculty", () => {
  const formFacultyStore = useFormFaculty();
  const nowForm = ref<Form | null>(null);
  const arrCourses = ref<Course[]>([]);

  const availableForms = computed(() =>
    formFacultyStore.arrForm || []
  );

  // Функция установки текущей формы обучения
  function setCurrentForm(form?: Form): void {
    if (form) {
      nowForm.value = form;
    } else if (availableForms.value.length > 0) {
      nowForm.value = availableForms.value[0];
    }
  }

  // Получения курсов данного факультета и данной формы обучения
  async function getCourseFaculty(faculty: Faculty): Promise<void> {
    try {
      if (availableForms.value.length === 0) {
        await formFacultyStore.getFormFaculty(faculty);
      }

      if (!nowForm.value) {
        setCurrentForm();
      }

      if (!nowForm.value) {
        throw new Error("Не удалось установить форму обучения");
      }

      console.log(`Текущая форма обучения: ${nowForm.value}`);

      const response = await fetch(
        `/api/schedule/courses?faculty=${faculty}&form=${nowForm.value}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Course[] = await response.json();   
      console.log("%c Курсы успешно загруженые:", 'background: red', data);

      arrCourses.value = data;
    } catch (error) {
      console.error("Ошибка в getCourseFaculty:", error);
    }
  }

  return {
    getCourseFaculty,
    setCurrentForm,
    nowForm,
    arrCourses,
    availableForms,
  };
});
