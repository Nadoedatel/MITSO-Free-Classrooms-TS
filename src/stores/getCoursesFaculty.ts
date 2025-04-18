import { useFormFaculty } from "@/stores/getFormFaculty";
import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";

interface Course {
  id: string
  name: string
}

interface Form {
  id: string
  name: string
}

export const useCoursesFaculty = defineStore("coursesFaculty", () => {
  const formFacultyStore = useFormFaculty();
  const nowFormOnFaculty: Ref<Form | string> = ref("");
  const arrCourses: Ref<Course[]> = ref([]);

  const availableForms = computed(
    () => formFacultyStore.arrFormOnFaculty || []
  );

  // Функция установки текущей формы обучения
  function setCurrentForm(form?:Form | string):void {
    if (form) {
      nowFormOnFaculty.value = form;
    } else if (availableForms.value.length > 0) {
      nowFormOnFaculty.value = availableForms.value[0];
    }
  }
  
  // Получения курсов данного факультета и данной формы обучения ( Экономический, дневная )
  async function getCourseFaculty(faculty:string | null = null): Promise<void> {
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

      const formName = typeof nowFormOnFaculty.value === 'string' ? nowFormOnFaculty.value : nowFormOnFaculty.value.name
      
      console.log(`Текущая форма обучения: ${formName}`);

      const response = await fetch(
        `/api/schedule/courses?faculty=${faculty}&form=${formName}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! статус: ${response.status}`);
      }

      const data: Course[] = await response.json();
      arrCourses.value = data;

      console.log("Курсы успешно загружены:", arrCourses.value);
    } catch (error) {
      console.error("Ошибка в загрузке курсов:", error instanceof Error ? error.message : String(error));
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
