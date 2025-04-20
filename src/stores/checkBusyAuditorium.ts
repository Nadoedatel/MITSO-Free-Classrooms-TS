import { useScheduleGroup } from "@/stores/getScheduleGroup";
import { useUserDate } from "@/stores/getUserDate";
import { useAuditorium } from "@/stores/objectAuditorium";
import { useGroupOnCourse } from "@/stores/getGroupCourses";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import { TIME_SLOTS } from "@/constants/timeSlots";
import { CORPUS_CONFIG } from "@/constants/corpusConfig";
import type { Lesson } from "@/types/lesson";
import type { Faculty } from "@/types/faculty";
import type { Form } from "@/types/form";
import type { Course } from "@/types/course";
import type { Group } from "@/types/group";
import type { CompleteStructureItem } from "@/types/structure"

export const useCheckBusyAuditorium = defineStore("checkBusyAuditorium", () => {
  const formScheduleStore = useScheduleGroup();
  const formUserDate = useUserDate();
  const formAuditoriumStore = useAuditorium();
  const formGroupStore = useGroupOnCourse();
  const formCourseStore = useCoursesFaculty();
  const formFacultyStore = useFormFaculty();

  const isLoading = ref(false);

  const { arrSchedule, nowForm, nowGroup, nowCourse } = storeToRefs(formScheduleStore);
  const { currentDate } = storeToRefs(formUserDate);
  const { arrForm, arrFaculty } = storeToRefs(formFacultyStore);
  const { arrCourses } = storeToRefs(formCourseStore);
  const { arrGroup } = storeToRefs(formGroupStore);

  const cache = ref<{ allLessons: Lesson[]; initialized: boolean }>({
    allLessons: [],
    initialized: false,
  });

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  formUserDate.getUserCurrentDate();

  const loadAllData = async (): Promise<void> => {
    try {
      isLoading.value = true;
      
      const allFaculties = arrFaculty.value || [];
      if (!allFaculties.length) {
        throw new Error("Нет доступных факультетов");
      }
  
      const completeData: CompleteStructureItem[] = [];
  
      for (const faculty of allFaculties) {
        console.log('%c Загрузка данных для факультета', 'background: yellow;', faculty.name);
  
        // 1. Загрузка форм обучения
        formFacultyStore.setCurrentFaculty(faculty.name);
        await formFacultyStore.getFormFaculty(faculty);
  
        const facultyForms = arrForm.value;
        if (!facultyForms.length) continue;
  
        for (const form of facultyForms) {
          if (!form?.name) continue;
  
          console.log('%c Загрузка данных для формы', 'background: green;', form.name);
          formCourseStore.setCurrentForm(form);
          await formCourseStore.getCourseFaculty(faculty);
  
          const formCourses = [...arrCourses.value];
          await delay(300);
  
          const coursesWithGroups: { course: Course; groups: Group[] }[] = [];
  
          for (const course of formCourses) {
            if (!course?.name) continue;
  
            console.log('%c Загрузка данных для курса', 'background: violet;', course.name);
            formGroupStore.setCurrentForm(form);
            formGroupStore.setGroup(course);
            await formGroupStore.getGroupCourse(faculty);
  
            const courseGroups = [...arrGroup.value];
            await delay(300);
  
            coursesWithGroups.push({ course, groups: courseGroups });
          }
  
          completeData.push({
            faculty,
            form,
            courses: coursesWithGroups,
          });
        }
      }
  
      // Сохраняем полную структуру в хранилище
      formFacultyStore.completeStructure = completeData;
  
      // Дополнительно: сохранить flat данные (если нужно где-то отдельно)
      arrForm.value = completeData.map(item => item.form);
      arrCourses.value = completeData.flatMap(item => item.courses.map(c => c.course));
      arrGroup.value = completeData.flatMap(item =>
        item.courses.flatMap(c => c.groups)
      );
  
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };
  

  const loadAllSchedules = async (): Promise<void> => {
    try {
      isLoading.value = true;
      cache.value.allLessons = [];
  
      const structure = formFacultyStore.completeStructure;
      if (!structure || !structure.length) {
        throw new Error("Сначала загрузите данные (loadAllData)");
      }
  
      const allSchedules: Lesson[] = [];
  
      for (const { faculty, form, courses } of structure) {
        for (const { course, groups } of courses) {
          for (const group of groups) {
            nowForm.value = form;
            nowCourse.value = course;
            nowGroup.value = group;
  
            console.log('%c Загрузка расписания для группы:', 'background: tan;', group.name, course.name, form.name, faculty.name);
            await formScheduleStore.getScheduleGroup(faculty);
  
            allSchedules.push(...(arrSchedule.value || []));
            await delay(300);
          }
        }
      }
  
      // Фильтрация по текущей дате
      const filteredLessons = allSchedules.filter(
        (lesson) => lesson?.date === currentDate.value
      );
  
      arrSchedule.value = filteredLessons;
      cache.value.allLessons.push(...filteredLessons);
  
    } catch (error) {
      console.error("Ошибка загрузки расписаний:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };
  

  const initFullSchedule = async (
    nameCorpus: keyof typeof CORPUS_CONFIG
  ): Promise<void> => {
    try {
      await formAuditoriumStore.initSchedule(
        CORPUS_CONFIG[nameCorpus],
        TIME_SLOTS
      );
      if (cache.value.allLessons.length > 0) {
        await bookAuditorium();
      }
    } catch (error) {
      console.error("Ошибка инициализации корпуса:", error);
      throw error;
    }
  };

  const bookAuditorium = async (): Promise<void> => {
    try {
      const auditoriumMap = new Map<
        string,
        {
          auditorium: string;
          time: string;
          lessons: { group: string; date: string; subject: string }[];
        }
      >();

      for (const lesson of cache.value.allLessons) {
        const { auditorium, time, group_class: group, date, subject } = lesson;

        if (!auditorium || !time || !group || !date) {
          console.warn("Пропуск элемента с неполными данными:", lesson);
          continue;
        }

        const key = `${auditorium}-${time}`;
        if (!auditoriumMap.has(key)) {
          auditoriumMap.set(key, { auditorium, time, lessons: [] });
        }

        auditoriumMap.get(key)!.lessons.push({
          group,
          date,
          subject: subject?.trim() || "Занятие",
        });
      }

      for (const { auditorium, time, lessons } of auditoriumMap.values()) {
        const mainLesson = lessons[0];
        const additionalGroups =
          lessons.length > 1 ? lessons.slice(1).map((l) => l.group) : undefined;

        await formAuditoriumStore.addLesson(auditorium, time, {
          group: mainLesson.group,
          date: mainLesson.date,
          subject: mainLesson.subject,
          additionalGroups,
        });

        if (additionalGroups) {
          console.log(
            `Аудитория ${auditorium}, время ${time}:`,
            `Основная группа ${mainLesson.group}`,
            `Совместно с ${additionalGroups.join(", ")}`
          );
        }
      }

      console.log(
        "Бронирование завершено. Обработано аудиторий:",
        auditoriumMap.size
      );
    } catch (error) {
      console.error("Ошибка бронирования аудиторий:", error);
      throw new Error("Не удалось распределить занятия по аудиториям");
    }
  };

  return {
    initFullSchedule,
    bookAuditorium,
    loadAllData,
    loadAllSchedules,
    isLoading,
    currentDate,
  };
});
