import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { useGroupOnCourse } from "@/stores/getGroupCourses";
import type { Course } from "@/types/course";
import type { Form } from "@/types/form";
import type { Group } from "@/types/group";
import type { Lesson } from "@/types/schedule";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useScheduleGroup = defineStore("scheduleGroup", () => {
  const formCourseStore = useCoursesFaculty();
  const formFacultyStore = useFormFaculty();
  const formGroupStore = useGroupOnCourse();

  const nowForm = ref<Form | null>(null);
  const nowCourse = ref<Course | null>(null);
  const nowGroup = ref<Group | null>(null);
  const arrSchedule = ref<Lesson[]>([]);

  const availableCourses = computed(() => formCourseStore.arrCourses || []);
  const availableForms = computed(() => formFacultyStore.arrForm || []);
  const availableGroups = computed(() => formGroupStore.arrGroup || []);

  function setCurrentCourse(course?: Course): void {
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

  function setCurrentGroup(group?: Group): void {
    if (group) {
      nowGroup.value = group;
    } else if (availableGroups.value.length > 0) {
      nowGroup.value = availableGroups.value[0];
    }
  }

  function processScheduleData(data: Lesson): void {
    if (!data || typeof data !== "object") {
      console.error("Некорректные данные расписания:", data);
      return;
    }

    const newSchedule: Lesson[] = [];

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

  async function getScheduleGroup(faculty: string | null = null): Promise<void> {
    try {
      if (availableForms.value.length === 0) {
        await formFacultyStore.getFormOnFaculty(faculty ?? undefined);
      }

      if (!nowForm.value) {
        setCurrentForm();
      }

      if (availableCourses.value.length === 0) {
        await formCourseStore.getCourseFaculty(faculty ?? undefined);
      }

      if (!nowCourse.value) {
        setCurrentCourse();
      }

      if (availableGroups.value.length === 0) {
        await formGroupStore.getGroupOnCourse(faculty ?? undefined);
      }

      if (!nowGroup.value) {
        setCurrentGroup();
      }

      if (
        !nowForm.value?.name ||
        !nowCourse.value?.name ||
        !nowGroup.value?.name
      ) {
        throw new Error("Не удалось установить все необходимые параметры");
      }

      console.log(`Загрузка расписания для: 
          Факультет: ${faculty},
          Форма: ${nowForm.value.name}, 
          Курс: ${nowCourse.value.name},
          Группа: ${nowGroup.value.name}`);

      const response = await fetch(
        `/api/schedule/group-schedules?faculty=${faculty}&form=${nowForm.value.name}&course=${nowCourse.value.name}&group=${nowGroup.value.name}`
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data: ScheduleData = await response.json();
      processScheduleData(data);
    } catch (error) {
      console.error("Ошибка при загрузке расписания:", error);
      throw error;
    }
  }

  return {
    getScheduleGroup,
    arrSchedule,
    nowForm,
    nowCourse,
    nowGroup,
  };
});
