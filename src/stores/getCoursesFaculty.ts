import { useFormFaculty } from "@/stores/getFormFaculty";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCoursesFaculty = defineStore("coursesFaculty", () => {
  const formFacultyStore = useFormFaculty();
  const nowFormOnFaculty = ref<string>("");
  const arrCourses = ref<any[]>([]); // Можно заменить any на конкретный тип, если знаешь структуру курсов

  const availableForms = computed<string[]>(() =>
    formFacultyStore.arrFormOnFaculty || []
  );

  // Функция установки текущей формы обучения
  function setCurrentForm(form?: string): void {
    if (form) {
      nowFormOnFaculty.value = form;
    } else if (availableForms.value.length > 0) {
      nowFormOnFaculty.value = availableForms.value[0];
    }
  }

  // Получения курсов данного факультета и данной формы обучения
  async function getCourseFaculty(faculty: string | null = null): Promise<void> {
    try {
      if (availableForms.value.length === 0) {
        await formFacultyStore.getFormOnFaculty(faculty ?? undefined);
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

      const data: any[] = await response.json(); // Заменить any[] на точный тип, если он известен
      arrCourses.value = data;

      console.log("Курсы успешно загружены:", arrCourses.value);
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
