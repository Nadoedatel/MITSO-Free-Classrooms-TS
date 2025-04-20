import { useFormFaculty } from "@/stores/getFormFaculty";
import type { Course } from "@/types/course";
import type { Faculty } from "@/types/faculty";
import type { Form } from "@/types/form";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCoursesFaculty = defineStore("coursesFaculty", () => {
  const formFacultyStore = useFormFaculty();
  const nowFormOnFaculty = ref<Form | null>(null);
  const arrCourses = ref<Course[]>([]);

  const availableForms = computed(() =>
    formFacultyStore.arrFormOnFaculty || []
  );

  // Функция установки текущей формы обучения
  function setCurrentForm(form?: Form): void {
    if (form) {
      nowFormOnFaculty.value = form;
    } else if (availableForms.value.length > 0) {
      nowFormOnFaculty.value = availableForms.value[0];
    }
  }

  // Получения курсов данного факультета и данной формы обучения
  async function getCourseFaculty(faculty: Faculty): Promise<void> {
    try {
      if (availableForms.value.length === 0) {
        await formFacultyStore.getFormOnFaculty(faculty);
      }

      if (!nowFormOnFaculty.value) {
        setCurrentForm();
      }

      if (!nowFormOnFaculty.value) {
        throw new Error("Не удалось установить форму обучения");
      }

      console.log(`Текущая форма обучения: ${nowFormOnFaculty.value}`);

      const response = await fetch(
        `/api/schedule/courses?faculty=${faculty}&form=${nowFormOnFaculty.value}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Course[] = await response.json();   
      console.log("Курсы успешно загруженые:", arrCourses.value);

      arrCourses.value = data;
    } catch (error) {
      console.error("Ошибка в getCourseFaculty:", error);
    }
  }

  return {
    getCourseFaculty,
    setCurrentForm,
    nowFormOnFaculty,
    arrCourses,
    availableForms,
  };
});
