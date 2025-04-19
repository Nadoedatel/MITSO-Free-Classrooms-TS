import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import type { Course, EducationForm, Faculty, Group } from "@/types/schedule";
import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";

export const useGroupOnCourse = defineStore("groupOnCourse", () => {
  const formCourseStore = useCoursesFaculty();
  const formFacultyStore = useFormFaculty();

  const arrGroup: Ref<Group[]> = ref([]);
  const nowCourseOnFormAndFaculty: Ref<Course | null> = ref(null);
  const nowFormOnFaculty: Ref<EducationForm | null> = ref(null);

  // Получаем ссылки на массивы из других хранилищ
  const availableCourses = computed(() => formCourseStore.arrCourses || []);
  const availableForms = computed(() => formFacultyStore.arrFormOnFaculty || []);

  function setGroup(course?: Course): void {
    if (course) {
      nowCourseOnFormAndFaculty.value = course;
    } else if (availableCourses.value.length > 0) {
      nowCourseOnFormAndFaculty.value = availableCourses.value[0];
    } else {
      nowCourseOnFormAndFaculty.value = null;
    }
  }

  function setCurrentForm(form?: EducationForm): void {
    if (form) {
      nowFormOnFaculty.value = form;
    } else if (availableForms.value.length > 0) {
      nowFormOnFaculty.value = availableForms.value[0];
    } else {
      nowFormOnFaculty.value = null;
    }
  }

  // Обработка полученных групп
  function deliveryGroupToArr(data:Group[]): void {
    if (!Array.isArray(data)) {
      console.error("Получены некорректные данные групп:", data);
      arrGroup.value = [];
      return;
    }

    // Более безопасное приведение типа с проверкой
    if (data.every(item => typeof item === 'object' && item !== null && 'id' in item && 'name' in item)) {
      arrGroup.value = data as Group[];
      console.log("Группы загружены:", arrGroup.value);
    } else {
      console.error("Некорректная структура данных групп:", data);
      arrGroup.value = [];
    }
  }

  // Получение групп по курсу
  const getGroupOnCourse = async (faculty: Faculty): Promise<void> => {
    try {
      if (!nowFormOnFaculty.value && availableForms.value.length === 0) {
        await formFacultyStore.getFormOnFaculty(faculty);
      }

      if (!nowFormOnFaculty.value) {
        setCurrentForm();
      }

      if (!nowCourseOnFormAndFaculty.value && availableCourses.value.length === 0) {
        await formCourseStore.getCourseFaculty(faculty);
      }

      if (!nowCourseOnFormAndFaculty.value) {
        setGroup();
      }

      if (!nowFormOnFaculty.value?.name || !nowCourseOnFormAndFaculty.value?.name) {
        throw new Error("Не удалось установить форму обучения или курс");
      }

      const response = await fetch(
        `/api/schedule/groups?faculty=${faculty}&form=${nowFormOnFaculty.value.name}&course=${nowCourseOnFormAndFaculty.value.name}`
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json() as Group[]; // Кастуем к Group[]
      deliveryGroupToArr(data);
    } catch (error) {
      console.error("Ошибка при загрузке групп:", error);
      throw error;
    }
  }

  return {
    setGroup,
    setCurrentForm,
    getGroupOnCourse,
    arrGroup,
    nowFormOnFaculty,
    nowCourseOnFormAndFaculty,
  };
});