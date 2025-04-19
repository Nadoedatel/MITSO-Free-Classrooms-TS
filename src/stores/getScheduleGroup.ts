import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { useGroupOnCourse } from "@/stores/getGroupCourses";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

// Типы
type NamedItem = {
  name: string;
  [key: string]: any;
};

type Lesson = {
  id: number;
  auditorium: string;
  time: string;
  group_class: string;
  subject: string;
};

type ScheduleData = {
  [week: string]: {
    [date: string]: Lesson[];
  };
};

export const useScheduleGroup = defineStore("scheduleGroup", () => {
  const formCourseStore = useCoursesFaculty();
  const formFacultyStore = useFormFaculty();
  const formGroupStore = useGroupOnCourse();

  const nowFormOnFaculty = ref<NamedItem | null>(null);
  const nowCourseOnFormAndFaculty = ref<NamedItem | null>(null);
  const nowNameGroup = ref<NamedItem | null>(null);
  const arrSchedule = ref<Lesson[]>([]);

  const availableCourses = computed<NamedItem[]>(() => formCourseStore.arrCourses || []);
  const availableForms = computed<NamedItem[]>(() => formFacultyStore.arrFormOnFaculty || []);
  const availableGroups = computed<NamedItem[]>(() => formGroupStore.arrGroup || []);

  function setCurrentCourse(course?: NamedItem): void {
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

  function setCurrentGroup(group?: NamedItem): void {
    if (group) {
      nowNameGroup.value = group;
    } else if (availableGroups.value.length > 0) {
      nowNameGroup.value = availableGroups.value[0];
    }
  }

  function processScheduleData(data: ScheduleData): void {
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

      if (!nowFormOnFaculty.value) {
        setCurrentForm();
      }

      if (availableCourses.value.length === 0) {
        await formCourseStore.getCourseFaculty(faculty ?? undefined);
      }

      if (!nowCourseOnFormAndFaculty.value) {
        setCurrentCourse();
      }

      if (availableGroups.value.length === 0) {
        await formGroupStore.getGroupOnCourse(faculty ?? undefined);
      }

      if (!nowNameGroup.value) {
        setCurrentGroup();
      }

      if (
        !nowFormOnFaculty.value?.name ||
        !nowCourseOnFormAndFaculty.value?.name ||
        !nowNameGroup.value?.name
      ) {
        throw new Error("Не удалось установить все необходимые параметры");
      }

      console.log(`Загрузка расписания для: 
          Факультет: ${faculty},
          Форма: ${nowFormOnFaculty.value.name}, 
          Курс: ${nowCourseOnFormAndFaculty.value.name},
          Группа: ${nowNameGroup.value.name}`);

      const response = await fetch(
        `/api/schedule/group-schedules?faculty=${faculty}&form=${nowFormOnFaculty.value.name}&course=${nowCourseOnFormAndFaculty.value.name}&group=${nowNameGroup.value.name}`
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
    nowFormOnFaculty,
    nowCourseOnFormAndFaculty,
    nowNameGroup,
  };
});
