import { useFormFaculty } from "@/stores/getFormFaculty";
import type { Course, EducationForm, Faculty } from "@/types/schedule";
import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";

export const useCoursesFaculty = defineStore("coursesFaculty", () => {
  const formFacultyStore = useFormFaculty();
  
  const nowFormOnFaculty: Ref<EducationForm | string> = ref("");
  const arrCourses: Ref<Course[]> = ref([]);

  const availableForms = computed<EducationForm[]>(
    () => formFacultyStore.arrFormOnFaculty || []
  );

  /**
   * Устанавливает текущую форму обучения.
   * @param form - Форма обучения (объект или строка). Если не передана, берёт первую доступную.
   */
  function setCurrentForm(form?: EducationForm | string): void {
    if (form) {
      nowFormOnFaculty.value = form;
    } else if (availableForms.value.length > 0) {
      nowFormOnFaculty.value = availableForms.value[0];
    }
  }

  /**
   * Получает курсы для указанного факультета и формы обучения.
   * @param faculty - Факультет (объект с полем `name`).
   * @throws {Error} Если не удалось установить форму обучения или получить данные.
   */
  async function getCourseFaculty(faculty: Faculty): Promise<void> {
    try {
      // Если формы обучения не загружены — загружаем
      if (availableForms.value.length === 0) {
        await formFacultyStore.getFormOnFaculty(faculty);
      }

      // Если текущая форма не установлена — устанавливаем
      if (!nowFormOnFaculty.value) {
        setCurrentForm();
      }

      // Если после всех проверок форма всё ещё не установлена — ошибка
      if (!nowFormOnFaculty.value) {
        throw new Error("Не удалось установить форму обучения");
      }

      // Получаем название формы (если это объект — берём `name`, если строка — оставляем как есть)
      const formName = typeof nowFormOnFaculty.value === 'string' 
        ? nowFormOnFaculty.value 
        : nowFormOnFaculty.value.name;

      console.log(`Текущая форма обучения: ${formName}`);

      // Делаем запрос к API
      const response = await fetch(
        `/api/schedule/courses?faculty=${faculty.name}&form=${encodeURIComponent(formName)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! статус: ${response.status}`);
      }

      // Парсим JSON и сохраняем курсы
      const data: Course[] = await response.json();
      arrCourses.value = data;

      console.log("Курсы успешно загружены:", arrCourses.value);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Неизвестная ошибка при загрузке курсов";
      console.error("Ошибка в загрузке курсов:", errorMessage);
      throw error; // Пробрасываем ошибку дальше для обработки в компоненте
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