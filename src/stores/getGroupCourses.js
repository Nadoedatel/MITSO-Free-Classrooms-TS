import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useGroupOnCourse = defineStore("groupOnCourse", () => {
  const formCourseStore = useCoursesFaculty();
  const formFacultyStore = useFormFaculty();
  const arrGroup = ref([]);
  const nowCourseOnFormAndFaculty = ref("");
  const nowFormOnFaculty = ref("");

  // Получаем ссылки на массивы из других хранилищ
  const availableCourses = computed(() => formCourseStore.arrCourses || []);
  const availableForms = computed(
    () => formFacultyStore.arrFormOnFaculty || []
  );

  function setGroup(course) {
    if (course) {
      nowCourseOnFormAndFaculty.value = course;
    } else if (availableCourses.value.length > 0) {
      nowCourseOnFormAndFaculty.value = availableCourses.value[0];
    }
  }

  function setCurrentForm(form) {
    if (form) {
      nowFormOnFaculty.value = form;
    } else if (availableForms.value.length > 0) {
      nowFormOnFaculty.value = availableForms.value[0];
    }
  }

  function deliveryGroupToArr(data) {
    if (!data || !Array.isArray(data)) {
      console.error("Получены некорректные данные групп:", data);
      return;
    }
    arrGroup.value = data;
    console.log("Группы загружены:", arrGroup.value);
  }

  async function getGroupOnCourse() {
    try {
      if (!availableForms.value?.length === 0) {
        await formFacultyStore.getFormOnFaculty();
      }

      if (!nowFormOnFaculty.value) {
        setCurrentForm();
      }

      if (!availableCourses.value?.length) {
        await formCourseStore.getCourseFaculty();
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
        `/api/schedule/groups?faculty=Экономический&form=${nowFormOnFaculty.value.name}&course=${nowCourseOnFormAndFaculty.value.name}`
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();
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
