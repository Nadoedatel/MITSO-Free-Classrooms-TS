import type { AllLesson } from "@/types/allLesson";
import type { Course } from "@/types/course";
import type { Faculty } from "@/types/faculty";
import type { Form } from "@/types/form";
import type { Group } from "@/types/group";
import type { Lesson } from "@/types/lesson";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useScheduleCorrectGroup = defineStore(
  "scheduleCorrectGroup",
  () => {
    const allInfoSchedule = ref<AllLesson>([]);
    const correctForm = ref<Form | null>(null);
    const correctCourse = ref<Course | null>(null);
    const correctGroup = ref<Group | null>(null);

    function allScheduleCurrentGroup(
      data: Record<string, Record<string, Lesson[]>>
    ): void {
      const newSchedule: Lesson[] = [];

      Object.values(data).forEach((week) => {
        Object.entries(week).forEach(([dateKey, dayLessons]) => {
          dayLessons.forEach((lesson) => {
            if (lesson.subject?.trim()) {
              newSchedule.push(lesson);
            }
          });
        });
      });

      allInfoSchedule.value = newSchedule;
      console.log(
        "Загружено занятий:",
        newSchedule.length,
        allInfoSchedule.value
      );
    }

    function setCurrentCourse(course: Course): void {
        correctCourse.value = course;
      }
  
      function setCurrentForm(form: Form): void {
        correctForm.value = form;
      }
  
      function setCurrentGroup(group: Group): void {
        correctGroup.value = group;
      }

    async function getScheduleCorrectGroup(
      faculty: Faculty,
      isScheduleGroup?: boolean
    ): Promise<void> {
      try {
        if (
          !faculty.name ||
          !correctForm.value?.name ||
          !correctCourse.value?.name ||
          !correctGroup.value?.name
        ) {
          console.log(
            faculty.name,
            correctForm.value?.name,
            correctCourse.value?.name,
            correctGroup.value?.name
          );
          throw new Error("Не удалось установить все необходимые параметры");
        }

        console.log(`Загрузка расписания для: 
          Факультет: ${faculty.name},
          Форма: ${correctForm.value.name}, 
          Курс: ${correctCourse.value.name},
          Группа: ${correctGroup.value.name}`);

        const response = await fetch(
          `/api/schedule/group-schedules?faculty=${faculty.name}&form=${correctForm.value.name}&course=${correctCourse.value.name}&group=${correctGroup.value.name}`
        );

        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data: Lesson = await response.json();
        console.log(
          "%c Расписание успешно загружено:",
          "background: gray",
          data
        );

        if (isScheduleGroup) {
          allScheduleCurrentGroup(data);
        }
      } catch (error) {
        console.error("Ошибка при загрузке расписания:", error);
        throw error;
      }
    }

    return {
      getScheduleCorrectGroup,
      setCurrentGroup,
      setCurrentForm,
      setCurrentCourse,
      correctForm,
      correctCourse,
      correctGroup,
      allInfoSchedule,
    };
  }
);
