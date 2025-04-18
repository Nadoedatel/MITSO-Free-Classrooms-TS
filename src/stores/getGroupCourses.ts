import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";

interface Course {
  id: string;
  name: string;
}

type Form = string | { id: string; name: string };

interface Group {
  id: string;
  name: string;
}

export const useGroupOnCourse = defineStore("groupOnCourse", () => {
  const formCourseStore = useCoursesFaculty();
  const formFacultyStore = useFormFaculty();

  const arrGroup: Ref<Group[]> = ref([]);
  const nowCourseOnFormAndFaculty: Ref<Course | null> = ref(null);
  const nowFormOnFaculty: Ref<Form | null> = ref(null);

  // Получаем ссылки на массивы из других хранилищ
  const availableCourses = computed<Course[]>(() => formCourseStore.arrCourses || []);
  const availableForms = computed<Form[]>(() => formFacultyStore.arrFormOnFaculty || []);

  function setGroup(course?: Course): void {
    if (course) {
      nowCourseOnFormAndFaculty.value = course;
    } else if (availableCourses.value.length > 0) {
      nowCourseOnFormAndFaculty.value = availableCourses.value[0];
    } else {
      nowCourseOnFormAndFaculty.value = null;
    }
  }

  function setCurrentForm(form?: Form): void {
    if (form) {
      nowFormOnFaculty.value = form;
    } else if (availableForms.value.length > 0) {
      nowFormOnFaculty.value = availableForms.value[0];
    } else {
      nowFormOnFaculty.value = null;
    }
  }

  // Обработка полученных групп
  function deliveryGroupToArr(data: unknown): void {
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
  async function getGroupOnCourse(faculty: string | null = null): Promise<void> {
    try {
      if (availableForms.value.length === 0) {
        await formFacultyStore.getFormOnFaculty();
      }

      if (!nowFormOnFaculty.value) {
        setCurrentForm();
      }

      if (availableCourses.value.length === 0) {
        await formCourseStore.getCourseFaculty(faculty);
      }

      if (!nowCourseOnFormAndFaculty.value) {
        setGroup();
      }

      // Безопасное получение имени формы
      const formName = typeof nowFormOnFaculty.value === 'string' 
        ? nowFormOnFaculty.value 
        : nowFormOnFaculty.value?.name;

      if (!formName || !nowCourseOnFormAndFaculty.value?.name) {
        throw new Error("Не удалось установить форму обучения или курс");
      }

      console.log(
        `Загрузка групп для формы "${formName}" и курса "${nowCourseOnFormAndFaculty.value.name}"`
      );

      const response = await fetch(
        `/api/schedule/groups?faculty=${faculty}&form=${formName}&course=${nowCourseOnFormAndFaculty.value.name}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error, статус: ${response.status}`);
      }

      const data = await response.json();
      deliveryGroupToArr(data);
    } catch (error) {
      console.error(
        "Ошибка при загрузке групп:", 
        error instanceof Error ? error.message : String(error)
      );
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