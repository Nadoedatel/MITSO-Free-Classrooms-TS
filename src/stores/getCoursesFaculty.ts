import { useFormFaculty } from "@/stores/getFormFaculty";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCoursesFaculty = defineStore("coursesFaculty", () => {
  const formFacultyStore = useFormFaculty();
  const nowFormOnFaculty = ref("");
  const arrCourses = ref([]);

  const availableForms = computed(
    () => formFacultyStore.arrFormOnFaculty || []
  );

  // Функция установки текущей формы обучения
  function setCurrentForm(form) {
    if (form) {
      nowFormOnFaculty.value = form;
    } else if (availableForms.value.length > 0) {
      nowFormOnFaculty.value = availableForms.value[0];
    }
  }
  
  // Получения курсов данного факультета и данной формы обучения ( Экономический, дневная )
  async function getCourseFaculty(faculty = null) {
    try {
      if (availableForms.value.length === 0) {
        await formFacultyStore.getFormOnFaculty();
      }

      if (!nowFormOnFaculty.value) {
        setCurrentForm();
      }

      if (!nowFormOnFaculty.value) {
        throw new Error("Не удалось установить форму обучения");
      }

      console.log(`Текущая форма обучения: ${nowFormOnFaculty.value.name}`);

      const response = await fetch(
        `/api/schedule/courses?faculty=${faculty}&form=${nowFormOnFaculty.value.name}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      arrCourses.value = data;
      console.log("Курсы успешно загружены:", arrCourses.value);
    } catch (error) {
      console.error("Ошибка в getCourseOnFaculty:", error);
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
