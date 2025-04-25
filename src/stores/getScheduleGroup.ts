import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { useGroupOnCourse } from "@/stores/getGroupCourses";
import type { AllLesson } from "@/types/allLesson";
import type { Course } from "@/types/course";
import type { Faculty } from "@/types/faculty";
import type { Form } from "@/types/form";
import type { Group } from "@/types/group";
import type { Lesson } from "@/types/lesson";
import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";

export const useScheduleGroup = defineStore("scheduleGroup", () => {
  const formCourseStore = useCoursesFaculty();
  const formFacultyStore = useFormFaculty();
  const formGroupStore = useGroupOnCourse();

  const nowGroup = ref<Group | null>(null);
  const arrSchedule = ref<Lesson[]>([]);
  const allInfoSchedule = ref<AllLesson[]>([])

  const { arrCourses, nowForm } = storeToRefs(formCourseStore);
  const { arrForm } = storeToRefs(formFacultyStore);
  const { arrGroup, nowCourse } = storeToRefs(formGroupStore);


  function setCurrentCourse(course?: Course): void {
    if (course) {
      nowCourse.value = course;
    } else if (arrCourses.value.length > 0) {
      nowCourse.value = arrCourses.value[0];
    }
  }

  function setCurrentForm(form?: Form): void {
    if (form) {
      nowForm.value = form;
    } else if (arrForm.value.length > 0) {
      nowForm.value = arrForm.value[0];
    }
  }

  function setCurrentGroup(group?: Group) {
    if (group) {
      nowGroup.value = group;
    } else if (arrGroup.value.length > 0) {
      nowGroup.value = arrGroup.value[0];
    }
  }

  function processScheduleData(data: Record<string, Record<string, Lesson[]>>): void {
    const newSchedule: Lesson[] = [];
  
    Object.values(data).forEach((week) => {
      Object.entries(week).forEach(([dateKey, dayLessons]) => {
        dayLessons.forEach((lesson) => {
          if (lesson.subject?.trim()) {
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
    console.log("Загружено занятий:", newSchedule.length);
  }

  function allScheduleCurrentGroup(data: Record<string, Record<string, Lesson[]>>):void {
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
      console.log("Загружено занятий:", newSchedule.length);
  }

  async function getScheduleGroup(faculty: Faculty, isScheduleGroup?: boolean): Promise<void> {
    try {
      if (arrForm.value.length === 0) {
        await formFacultyStore.getFormFaculty(faculty);
      }

      if (!nowForm.value) {
        setCurrentForm();
      }

      if (arrCourses.value.length === 0) {
        await formCourseStore.getCourseFaculty(faculty);
      }

      if (!nowCourse.value) {
        setCurrentCourse();
      }

      if (arrGroup.value.length === 0) {
        await formGroupStore.getGroupCourse(faculty);
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
          Факультет: ${faculty.name},
          Форма: ${nowForm.value.name}, 
          Курс: ${nowCourse.value.name},
          Группа: ${nowGroup.value.name}`);

      const response = await fetch(
        `/api/schedule/group-schedules?faculty=${faculty.name}&form=${nowForm.value.name}&course=${nowCourse.value.name}&group=${nowGroup.value.name}`
      );

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data: Lesson = await response.json();
      console.log("%c Расписание успешно загружено:", 'background: gray', data);

      if (isScheduleGroup) {
        allScheduleCurrentGroup(data)
        console.log("%c Расписание передаем полностью:", 'background: gray');
      }

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
