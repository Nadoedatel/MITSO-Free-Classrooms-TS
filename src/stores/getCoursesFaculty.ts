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

  // Получения курсов данного факультета и данной формы обучения
  async function getCourseFaculty(faculty: Faculty): Promise<void> {
    try {
      if (arrForm.value.length === 0) {
        await formFacultyStore.getFormFaculty(faculty);
      }
      
      if (!nowForm.value) {
        setCurrentForm();
      }

      if (!nowForm.value) {
        throw new Error("Не удалось установить форму обучения");
      }

      console.log(`Текущая форма обучения: ${nowForm.value.name}, Факультет ${faculty.name}`);

      const response = await fetch(
        `/api/schedule/courses?faculty=${faculty.name}&form=${nowForm.value.name}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Course[] = await response.json();  

      arrCourses.value = data;
      console.log("%c Курсы успешно загруженые:", 'background: red', arrCourses.value);
    } catch (error) {
      console.error("Ошибка в getCourseFaculty:", error);
    }
  }

  return {
    getCourseFaculty,
    setCurrentForm,
    nowForm,
    arrCourses,
  };
});
