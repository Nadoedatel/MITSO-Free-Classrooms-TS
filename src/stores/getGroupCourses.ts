import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

type NamedItem = {
  name: string;
  [key: string]: any;
};

export const useGroupOnCourse = defineStore("groupOnCourse", () => {
  const formCourseStore = useCoursesFaculty();
  const formFacultyStore = useFormFaculty();

  const arrGroup = ref<any[]>([]); // Заменить any[] на точный тип, если есть
  const nowCourseOnFormAndFaculty = ref<NamedItem | null>(null);
  const nowFormOnFaculty = ref<NamedItem | null>(null);

  const availableCourses = computed<NamedItem[]>(() => formCourseStore.arrCourses || []);
  const availableForms = computed<NamedItem[]>(() => formFacultyStore.arrFormOnFaculty || []);

  function setGroup(course?: NamedItem): void {
    if (course) {
      nowCourseOnFormAndFaculty.value = course;
    } else if (availableCourses.value.length > 0) {
      nowCourseOnFormAndFaculty.value = availableCourses.value[0];
    }
  }

  function setCurrentForm(form?: NamedItem): void {
    if (form) {
      nowFormOnFaculty.value = form;
    } else if (availableForms.value.length > 0) {
      nowFormOnFaculty.value = availableForms.value[0];
    }
  }

  function deliveryGroupToArr(data: any[]): void {
    if (!data || !Array.isArray(data)) {
      console.error("Получены некорректные данные групп:", data);
      return;
    }
    arrGroup.value = data;
    console.log("Группы загружены:", arrGroup.value);
  }

  async function getGroupOnCourse(faculty: string | null = null): Promise<void> {
    try {
      if (!availableForms.value.length) {
        await formFacultyStore.getFormOnFaculty(faculty ?? undefined);
      }

      if (!nowFormOnFaculty.value) {
        setCurrentForm();
      }

      if (!availableCourses.value.length) {
        await formCourseStore.getCourseFaculty(faculty ?? undefined);
      }

      if (!nowCourseOnFormAndFaculty.value) {
        setGroup();
      }

      if (
        !nowFormOnFaculty.value?.name ||
        !nowCourseOnFormAndFaculty.value?.name
      ) {
        throw new Error("Не удалось установить форму обучения или курс");
      }

      console.log(
        `Загрузка групп для формы "${nowFormOnFaculty.value.name}" и курса "${nowCourseOnFormAndFaculty.value.name}"`
      );

      const response = await fetch(
        `/api/schedule/groups?faculty=${faculty}&form=${nowFormOnFaculty.value.name}&course=${nowCourseOnFormAndFaculty.value.name}`
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data: any[] = await response.json(); // Можно уточнить тип массива
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
