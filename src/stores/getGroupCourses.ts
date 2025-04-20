import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import type { Course } from "@/types/course";
import type { Faculty } from "@/types/faculty";
import type { Form } from "@/types/form";
import type { Group } from "@/types/group";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useGroupOnCourse = defineStore("groupOnCourse", () => {
  const formCourseStore = useCoursesFaculty();
  const formFacultyStore = useFormFaculty();

  const arrGroup = ref<Group[]>([]); 
  const nowCourse = ref<Course | null>(null);
  const nowForm = ref<Form | null>(null);

  const availableCourses = computed(() => formCourseStore.arrCourses || []);
  const availableForms = computed(() => formFacultyStore.arrForm || []);

  function setGroup(course?: Group): void {
    if (course) {
      nowCourse.value = course;
    } else if (availableCourses.value.length > 0) {
      nowCourse.value = availableCourses.value[0];
    }
  }

  function setCurrentForm(form?: Form): void {
    if (form) {
      nowForm.value = form;
    } else if (availableForms.value.length > 0) {
      nowForm.value = availableForms.value[0];
    }
  }

  function setGroupInArr(data: Group): void {
    if (!data || !Array.isArray(data)) {
      console.error("Получены некорректные данные групп:", data);
      return;
    }
    arrGroup.value = data;
    console.log("Группы загружены:", arrGroup.value);
  }

  async function getGroupCourse(faculty: Faculty): Promise<void> {
    try {
      if (!availableForms.value.length) {
        await formFacultyStore.getFormFaculty(faculty);
      }

      if (!nowForm.value) {
        setCurrentForm();
      }

      if (!availableCourses.value.length) {
        await formCourseStore.getCourseFaculty(faculty);
      }

      if (!nowCourse.value) {
        setGroup();
      }

      if (
        !nowForm.value?.name ||
        !nowCourse.value?.name
      ) {
        throw new Error("Не удалось установить форму обучения или курс");
      }

      console.log(
        `Загрузка групп для формы "${nowForm.value.name}" и курса "${nowCourse.value.name}"`
      );

      const response = await fetch(
        `/api/schedule/groups?faculty=${faculty}&form=${nowForm.value.name}&course=${nowCourse.value.name}`
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data: Group = await response.json();
      console.log("%c Курсы успешно загруженые:", 'background: red', data);

      setGroupInArr(data);
    } catch (error) {
      console.error("Ошибка при загрузке групп:", error);
      throw error;
    }
  }

  return {
    setGroup,
    setCurrentForm,
    getGroupCourse,
    arrGroup,
    nowForm,
    nowCourse,
  };
});
