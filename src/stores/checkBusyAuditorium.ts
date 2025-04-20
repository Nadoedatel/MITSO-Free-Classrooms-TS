import { useScheduleGroup } from "@/stores/getScheduleGroup";
import { useUserDate } from "@/stores/getUserDate";
import { useAuditorium } from "@/stores/objectAuditorium";
import { useGroupOnCourse } from "@/stores/getGroupCourses";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import type { Faculty } from "@/types/faculty";

interface Lesson {
  auditorium: string;
  time: string;
  group_class: string;
  date: string;
  subject: string;
  [key: string]: any;
}

interface Course {
  name: string;
}

interface Group {
  name: string;
}

interface Form {
  name: string;
}

interface CompleteCourseStructure {
  course: Course;
  groups: Group[];
}

interface CompleteFormStructure {
  faculty: string;
  form: Form;
  courses: CompleteCourseStructure[];
}

export const useCheckBusyAuditorium = defineStore("checkBusyAuditorium", () => {
  const formScheduleStore = useScheduleGroup();
  const formUserDate = useUserDate();
  const formAuditoriumStore = useAuditorium();
  const formGroupStore = useGroupOnCourse();
  const formCourseStore = useCoursesFaculty();
  const formFacultyStore = useFormFaculty();

  const isLoading = ref(false);

  const {
    arrSchedule,
    nowFormOnFaculty,
    nowNameGroup,
    nowCourseOnFormAndFaculty,
  } = storeToRefs(formScheduleStore);
  const { currentDate } = storeToRefs(formUserDate);
  const { arrForm, arrFaculty } = storeToRefs(formFacultyStore);
  const { arrCourses } = storeToRefs(formCourseStore);
  const { arrGroup } = storeToRefs(formGroupStore);

  const timeSlots = [
    "08.00-9.25",
    "09.35-11.00",
    "11.10-12.35",
    "13.05-14.30",
    "14.40-16.05",
    "16.35-18.00",
    "18.10-19.35",
    "19.45-21.10",
  ];

  const corpusConfig: Record<string, string[]> = {
    auditoriumsInNewCorpus: [
      "71", "72 (к)", "73 (к)", "61", "62 (к)", "63 (к)", "64", "51", "52", "53", "54",
      "41", "42", "43", "44", "31", "32", "33", "34", "21", "22", "23", "24",
    ],
    auditoriumsInOldCorpus: [
      "503", "502", "410", "409 (к)", "407 (к)", "406", "405", "307", "306", "305",
      "304", "211", "216", "222", "111",
    ],
    auditoriumsInDormitory: [
      "909 чжф", "809 чжф", "709 чжф", "509 чжф", "409 чжф", "309 чжф", "209 чжф", "207 чжф", "206 чжф",
    ],
  };

  const cache = ref<{ allLessons: Lesson[]; initialized: boolean }>({
    allLessons: [],
    initialized: false,
  });

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  formUserDate.getUserCurrentDate();

  const loadAllData = async (): Promise<void> => {
    try {
      isLoading.value = true;

      const allFaculties: Faculty[] = arrFaculty.value || [];
      if (allFaculties.length === 0) {
        throw new Error("Нет доступных факультетов");
      }

      const completeData: CompleteFormStructure[] = [];
      const allForms = [];

      for (const faculty of allFaculties) {
        console.log(`Загрузка данных для факультета: ${faculty.name}`);
        formFacultyStore.setCurrentFaculty(faculty.name);
        if (arrForm.value.length === 0) {
          await formFacultyStore.getFormFaculty(faculty);
        }

        const facultyForms: Form[] = arrForm.value || [];
        if (!facultyForms.length) continue;

        allForms.push(...facultyForms);

        const formsWithCourses = [];
        for (const form of facultyForms) {
          console.log(`Установили форму обучения: ${form.name}`);
          if (!form?.name) continue;

          formCourseStore.setCurrentForm(form.name);
          await formCourseStore.getCourseFaculty(faculty.name);

          formsWithCourses.push({
            form,
            courses: [...arrCourses.value],
          });

          await delay(300);
        }

        for (const { form, courses } of formsWithCourses) {
          const courseList: CompleteCourseStructure[] = [];

          for (const course of courses) {
            if (!course?.name) continue;

            formGroupStore.setCurrentForm(form);
            formGroupStore.setGroup(course);
            await formGroupStore.getGroupCourse(faculty);

            courseList.push({
              course,
              groups: [...arrGroup.value],
            });

            await delay(300);
          }

          completeData.push({ faculty, form, courses: courseList });
        }
      }

      formFacultyStore.arrForm.value = allForms;
      formCourseStore.arrCourses.value = completeData.flatMap((f) =>
        f.courses.map((c) => c.course)
      );
      formGroupStore.arrGroup.value = completeData.flatMap((f) =>
        f.courses.flatMap((c) => c.groups)
      );
      formFacultyStore.completeStructure = completeData;
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const loadAllSchedules = async (): Promise<void> => {
    try {
      isLoading.value = true;
      cache.value.allLessons = [];

      if (!formFacultyStore.completeStructure) {
        throw new Error("Сначала загрузите данные (loadAllData)");
      }

      const allSchedules: Lesson[] = [];

      for (const { faculty, form, courses } of formFacultyStore.completeStructure) {
        for (const { course, groups } of courses) {
          for (const group of groups) {
            nowFormOnFaculty.value = form;
            nowCourseOnFormAndFaculty.value = course;
            nowNameGroup.value = group;

            await formScheduleStore.getScheduleGroup(faculty);
            allSchedules.push(...(arrSchedule.value || []));
            await delay(300);
          }
        }
      }

      const filteredLessons = allSchedules.filter(
        (lesson) => lesson?.date === currentDate.value
      );

      formScheduleStore.arrSchedule.value = filteredLessons;
      cache.value.allLessons.push(...filteredLessons);
    } catch (error) {
      console.error("Ошибка загрузки расписаний:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const initFullSchedule = async (nameCorpus: keyof typeof corpusConfig): Promise<void> => {
    try {
      await formAuditoriumStore.initSchedule(corpusConfig[nameCorpus], timeSlots);
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
      const auditoriumMap = new Map<string, {
        auditorium: string;
        time: string;
        lessons: { group: string; date: string; subject: string }[];
      }>();

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
        const additionalGroups = lessons.length > 1
          ? lessons.slice(1).map((l) => l.group)
          : undefined;

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

      console.log("Бронирование завершено. Обработано аудиторий:", auditoriumMap.size);
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
