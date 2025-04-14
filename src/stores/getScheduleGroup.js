import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { useGroupOnCourse } from "@/stores/getGroupCourses";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useScheduleGroup = defineStore("scheduleGroup", () => {
  const formCourseStore = useCoursesFaculty();
  const formFacultyStore = useFormFaculty();
  const formGroupStore = useGroupOnCourse();

  const nowFormOnFaculty = ref("");
  const nowNameGroup = ref("");
  const nowCourseOnFormAndFaculty = ref("");
  const arrSchedule = ref([]);

  // Получаем ссылки на массивы из других хранилищ
  const availableCourses = computed(() => formCourseStore.arrCourses || []);
  const availableForms = computed(
    () => formFacultyStore.arrFormOnFaculty || []
  );
  const availableGroups = computed(() => formGroupStore.arrGroup || []);

  function setCurrentCourse(course) {
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

  function setCurrentGroup(group) {
    if (group) {
      nowNameGroup.value = group;
    } else if (availableGroups.value.length > 0) {
      nowNameGroup.value = availableGroups.value[0];
    }
  }

  function processScheduleData(data) {
    if (!data || typeof data !== "object") {
      console.error("Некорректные данные расписания:", data);
      return;
    }

    const newSchedule = [];

    Object.values(data).forEach((week) => {
      if (!week || typeof week !== "object") return;

      Object.entries(week).forEach(([dateKey, dayLessons]) => {
        if (!Array.isArray(dayLessons)) return;

        dayLessons.forEach((lesson) => {
          if (lesson?.subject?.trim()) {
            newSchedule.push({
              id: lesson.id,
              date: dateKey,
              auditorium: lesson.auditorium,
              time: lesson.time,
              group_class: lesson.group_class,
              subject: lesson.subject.trim(),
            });
          }
        });
      });
    });

    arrSchedule.value = newSchedule;
    console.log("Загружено занятий:", arrSchedule.value);
  }

  async function getScheduleGroup() {
    try {
      // Загружаем формы обучения при необходимости
      if (availableForms.value.length === 0) {
        await formFacultyStore.getFormOnFaculty();
      }

      if (!nowFormOnFaculty.value) {
        setCurrentForm();
      }

      // Загружаем курсы при необходимости
      if (availableCourses.value.length === 0) {
        await formCourseStore.getCourseFaculty();
      }
      if (!nowCourseOnFormAndFaculty.value) {
        setCurrentCourse();
      }


      // Загружаем группы при необходимости
      if (availableGroups.value.length === 0) {
        await formGroupStore.getGroupOnCourse();
      }
      if (!nowNameGroup.value) {
        setCurrentGroup();
      }
      // Проверяем что все необходимые данные установлены
      if (
        !nowFormOnFaculty.value?.name ||
        !nowCourseOnFormAndFaculty.value?.name ||
        !nowNameGroup.value?.name
      ) {
        throw new Error("Не удалось установить все необходимые параметры");
      }

      console.log(`Загрузка расписания для: 
          Форма: ${nowFormOnFaculty.value.name}, 
          Курс: ${nowCourseOnFormAndFaculty.value.name},
          Группа: ${nowNameGroup.value.name}`);

      const response = await fetch(
        `/api/schedule/group-schedules?faculty=Экономический&form=${nowFormOnFaculty.value.name}&course=${nowCourseOnFormAndFaculty.value.name}&group=${nowNameGroup.value.name}`
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();
      processScheduleData(data);
    } catch (error) {
      console.error("Ошибка при загрузке расписания:", error);
      throw error;
    }
  }

  return {
    getScheduleGroup,
    arrSchedule,
    nowFormOnFaculty,
    nowCourseOnFormAndFaculty,
    nowNameGroup,
  };
});
