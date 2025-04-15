import { useScheduleGroup } from "@/stores/getScheduleGroup";
import { useUserDate } from "@/stores/getUserDate";
import { useAuditorium } from "@/stores/objectAuditorium";
import { useGroupOnCourse } from "@/stores/getGroupCourses";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";

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
  const { arrFormOnFaculty } = storeToRefs(formFacultyStore);
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

  const corpusConfig = {
    auditoriumsInNewCorpus: [
      "71",
      "72 (к)",
      "73 (к)",
      "61",
      "62 (к)",
      "63 (к)",
      "64",
      "51",
      "52",
      "53",
      "54",
      "41",
      "42",
      "43",
      "44",
      "31",
      "32",
      "33",
      "34",
      "21",
      "22",
      "23",
      "24",
    ],
    auditoriumsInOldCorpus: [
      "503",
      "502",
      "410",
      "407 (к)",
      "406",
      "405",
      "307",
      "306",
      "305",
      "304",
      "211",
      "216",
      "222",
      "111",
    ],
    auditoriumsInDormitory: [
      "909 чжф",
      "809 чжф",
      "709 чжф",
      "509 чжф",
      "409 чжф",
      "309 чжф",
      "209 чжф",
      "207 чжф",
      "206 чжф",
    ],
  };

  const cache = ref({
    allLessons: [],
    initialized: false,
  });
  // Вспомогательные функции
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Получение текущей даты при инициализации
  formUserDate.getUserCurrentDate();

  const loadAllData = async () => {
    try {
      isLoading.value = true;

      // 1. Загружаем все формы обучения
      if (arrFormOnFaculty.value.length === 0) {
        await formFacultyStore.getFormOnFaculty();
      }

      const allForms = arrFormOnFaculty.value;
      if (allForms.length === 0) throw new Error("Нет доступных форм обучения");

      // 2. Для каждой формы загружаем курсы и сохраняем связь
      const formsWithCourses = [];

      for (const form of allForms) {
        if (!form?.name) continue;

        // Устанавливаем текущую форму
        formCourseStore.setCurrentForm(form);
        await formCourseStore.getCourseFaculty();

        // Сохраняем форму с её курсами
        formsWithCourses.push({
          form,
          courses: [...arrCourses.value], // Копируем массив курсов
        });

        await delay(300);
      }

      // 3. Для каждого курса каждой формы загружаем группы
      const completeData = [];

      for (const { form, courses } of formsWithCourses) {
        const formWithCoursesAndGroups = {
          form,
          courses: [],
        };

        for (const course of courses) {
          if (!course?.name) continue;

          // Устанавливаем текущие форму и курс
          formGroupStore.setCurrentForm(form);
          formGroupStore.setGroup(course);
          await formGroupStore.getGroupOnCourse();

          // Сохраняем курс с его группами
          formWithCoursesAndGroups.courses.push({
            course,
            groups: [...arrGroup.value], // Копируем массив групп
          });

          await delay(300);
        }

        completeData.push(formWithCoursesAndGroups);
      }

      // 4. Сохраняем структурированные данные
      formFacultyStore.arrFormOnFaculty.value = allForms;
      formCourseStore.arrCourses.value = completeData.flatMap((f) =>
        f.courses.map((c) => c.course)
      );
      formGroupStore.arrGroup.value = completeData.flatMap((f) =>
        f.courses.flatMap((c) => c.groups)
      );

      // Для удобства можно сохранить и полную структуру
      formFacultyStore.completeStructure = completeData;
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const loadAllSchedules = async () => {
    try {
      isLoading.value = true;
      cache.value.allLessons = [];

      if (!formFacultyStore.completeStructure) {
        throw new Error("Сначала загрузите данные (loadAllData)");
      }

      const allSchedules = [];

      for (const { form, courses } of formFacultyStore.completeStructure) {
        for (const { course, groups } of courses) {
          for (const group of groups) {
            // Устанавливаем текущий контекст
            nowFormOnFaculty.value = form;
            nowCourseOnFormAndFaculty.value = course;
            nowNameGroup.value = group;

            // Загружаем расписание
            await formScheduleStore.getScheduleGroup();

            // Добавляем в общий массив
            allSchedules.push(...(arrSchedule.value || []));

            await delay(300);
          }
        }
      }

      // Фильтрация и сохранение
      const filteredLessons = allSchedules.filter(
        (lesson) => lesson?.date === currentDate.value
      );
      alert("ЗАГРУЗИЛОСЬ!");
      formScheduleStore.arrSchedule.value = filteredLessons; // Сохраняем в хранилище
      cache.value.allLessons.push(...filteredLessons); // Добавляем в кеш
    } catch (error) {
      console.error("Ошибка загрузки расписаний:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Инициализация полного расписания
  const initFullSchedule = async (nameCorpus) => {
    try {
      // Инициализируем аудитории
      await formAuditoriumStore.initSchedule(
        corpusConfig[nameCorpus],
        timeSlots
      );

      // Бронируем аудитории с учетом структуры данных
      if (cache.value.allLessons.length > 0) {
        await bookAuditorium();
      }
    } catch (error) {
      console.error("Ошибка инициализации корпуса:", error);
      throw error;
    }
  };

  const bookAuditorium = async () => {
    try {
      // Создаем карту аудиторий для группировки занятий
      const auditoriumMap = new Map();

      // 1. Группируем занятия по аудиториям и времени
      for (const lesson of cache.value.allLessons) {
        const { auditorium, time, group_class: group, date, subject } = lesson;

        if (!auditorium || !time || !group || !date) {
          console.warn("Пропуск элемента с неполными данными:", lesson);
          continue;
        }

        const key = `${auditorium}-${time}`;
        if (!auditoriumMap.has(key)) {
          auditoriumMap.set(key, {
            auditorium,
            time,
            lessons: [],
          });
        }

        auditoriumMap.get(key).lessons.push({
          group,
          date,
          subject: subject?.trim() || "Занятие",
        });
      }

      // 2. Записываем занятия в хранилище аудиторий
      for (const [_, { auditorium, time, lessons }] of auditoriumMap) {
        const mainLesson = lessons[0]; // Основное занятие
        const additionalGroups =
          lessons.length > 1 ? lessons.slice(1).map((l) => l.group) : undefined;

        await formAuditoriumStore.addLesson(auditorium, time, {
          group: mainLesson.group,
          date: mainLesson.date,
          subject: mainLesson.subject,
          // Добавляем информацию о пересечениях
          additionalGroups: additionalGroups,
        });

        // Логируем для отладки
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
