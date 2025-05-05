import { computed } from "vue";
import type { CompleteStructureItem } from "@/types/structure";
import useFacultyForms from "./useFormFaculty";
import useCourses from "./useCoursesFaculty";
import useGroups from "./useGroupCourse";
import useSchedule from "./useScheduleGroup";
import { useAuditorium } from "@/stores/objectAuditorium";
import type { Lesson } from "@/types/lesson";
import { CORPUS_CONFIG } from "@/constants/corpusConfig";
import { TIME_SLOTS } from "@/constants/timeSlots";
import { useAuditoriumCheckStore } from "@/stores/checkBusyAuditorium";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useScheduleGroup } from "@/stores/getScheduleGroup"; // Добавляем импорт
import { useUserDate } from "@/stores/getUserDate";

export default function useAuditoriumBusyCheck() {
  const checkStore = useAuditoriumCheckStore();
  const scheduleStore = useScheduleGroup(); // Инициализируем хранилище расписания
  const userDateStore = useUserDate(); // Инициализируем хранилище даты
  const currentDate = computed(() => userDateStore.currentDate); // Используем дату из хранилища

  const { fetchFacultyForms, faculties, forms } = useFacultyForms();
  const { fetchCourses } = useCourses();
  const { fetchGroups, setCurrentCourse } = useGroups();
  const { fetchSchedule, setCurrentGroup } = useSchedule();
  const { initSchedule, addLesson } = useAuditorium();

  const coursesStore = useCoursesFaculty();

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const loadAllData = async (): Promise<void> => {
    try {
      checkStore.isLoading = true;
      const completeData: CompleteStructureItem[] = [];

      if (faculties.value.length === 0) {
        await fetchFacultyForms();
      }

      for (const faculty of faculties.value) {
        await fetchFacultyForms(faculty);

        for (const form of forms.value) {
          coursesStore.setCurrentForm(form);
          const coursesList = await fetchCourses(faculty);
          
          const coursesWithGroups = [];
          for (const course of coursesList) {
            setCurrentCourse(course);
            const groupsList = await fetchGroups(faculty);
            
            coursesWithGroups.push({
              course,
              groups: groupsList
            });
            await delay(300);
          }
          
          completeData.push({ 
            faculty, 
            form, 
            courses: coursesWithGroups 
          });
        }
      }
      
      checkStore.cache.completeStructure = completeData;
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      throw error;
    } finally {
      checkStore.isLoading = false;
    }
  };

  const loadAllSchedules = async (): Promise<Lesson[]> => {
    try {
      checkStore.isLoading = true;
      const allSchedules: Lesson[] = [];

      if (!checkStore.cache.completeStructure.length) {
        throw new Error("Сначала загрузите данные (loadAllData)");
      }

      // Убедимся, что дата установлена
      if (!currentDate.value) {
        userDateStore.getUserCurrentDate();
      }

      for (const { faculty, form, courses } of checkStore.cache.completeStructure) {
        coursesStore.setCurrentForm(form);

        for (const { course, groups } of courses) {
          setCurrentCourse(course);

          for (const group of groups) {
            setCurrentGroup(group);
            await fetchSchedule(faculty);
            
            if (Array.isArray(scheduleStore.arrSchedule)) {
              // Фильтрация по дате из хранилища
              const filteredLessons = scheduleStore.arrSchedule.filter(
                (lesson) => lesson?.date === currentDate.value
              );
              allSchedules.push(...filteredLessons);
            }
            await delay(300);
          }
        }
      }

      checkStore.cache.allLessons = allSchedules;
      return allSchedules;
    } catch (error) {
      console.error("Ошибка при загрузке расписаний:", error);
      throw error;
    } finally {
      checkStore.isLoading = false;
    }
  };


  const initFullSchedule = async (nameCorpus: keyof typeof CORPUS_CONFIG): Promise<void> => {
    try {
      await initSchedule(CORPUS_CONFIG[nameCorpus], TIME_SLOTS);
      
      // Восстанавливаем сохраненные бронирования
      const savedBookings = localStorage.getItem('auditoriumBookings');
      if (savedBookings) {
        try {
          const bookingsData = JSON.parse(savedBookings);
          for (const booking of bookingsData.bookings) {
            await addLesson(
              booking.auditorium, 
              booking.time, 
              {
                group: booking.mainGroup,
                date: booking.date,
                subject: booking.subject,
                additionalGroups: booking.additionalGroups || []
              }
            );
          }
        } catch (e) {
          console.error('Ошибка загрузки данных:', e);
        }
      }

      // Бронируем аудитории на основе загруженного расписания
      if (checkStore.cache.allLessons.length) {
        await bookAuditorium();
      }
    } catch (error) {
      console.error("Ошибка инициализации:", error);
      throw error;
    }
  };

  const bookAuditorium = async (): Promise<void> => {
    try {
      const auditoriumMap = new Map<string, {
        auditorium: string;
        time: string;
        lessons: Lesson[];
      }>();

      // Группируем занятия по аудиториям и времени
      for (const lesson of checkStore.cache.allLessons) {
        if (!lesson.auditorium || !lesson.time) continue;
        
        const key = `${lesson.auditorium}-${lesson.time}`;
        if (!auditoriumMap.has(key)) {
          auditoriumMap.set(key, {
            auditorium: lesson.auditorium,
            time: lesson.time,
            lessons: []
          });
        }
        auditoriumMap.get(key)!.lessons.push(lesson);
      }

      // Сохраняем в localStorage
      const bookingData = {
        timestamp: new Date().toISOString(),
        bookings: Array.from(auditoriumMap.values()).map(item => ({
          auditorium: item.auditorium,
          time: item.time,
          mainGroup: item.lessons[0]?.group_class || '',
          date: item.lessons[0]?.date || '',
          subject: item.lessons[0]?.subject || 'Занятие',
          additionalGroups: item.lessons.slice(1).map(l => l.group_class)
        }))
      };

      localStorage.setItem('auditoriumBookings', JSON.stringify(bookingData));

      // Добавляем занятия в расписание
      for (const { auditorium, time, lessons } of auditoriumMap.values()) {
        await addLesson(
          auditorium,
          time,
          {
            group: lessons[0]?.group_class || '',
            date: lessons[0]?.date || '',
            subject: lessons[0]?.subject || 'Занятие',
            additionalGroups: lessons.slice(1).map(l => l.group_class)
          }
        );
      }

    } catch (error) {
      console.error("Ошибка бронирования:", error);
      throw error;
    }
  };

  return {
    loadAllData,
    loadAllSchedules,
    initFullSchedule,
    bookAuditorium,
    isLoading: computed(() => checkStore.isLoading)
  };
}