import { computed } from "vue";
import type { CompleteStructureItem } from "@/types/structure";
import useFacultyForms from "./useFacultyForm";
import useCourses from "./useCoursesFaculty";
import useGroups from "./useGroupCourse";
import useSchedule from "./useScheduleGroup";
import { useAuditorium } from "@/stores/objectAuditorium";
import type { Lesson } from "@/types/lesson";
import { CORPUS_CONFIG } from "@/constants/corpusConfig";
import { TIME_SLOTS } from "@/constants/timeSlots";
import { useAuditoriumCheckStore } from "@/stores/checkBusyAuditorium";

export default function useAuditoriumBusyCheck() {
  const checkStore = useAuditoriumCheckStore();
  const { fetchFacultyForms, faculties } = useFacultyForms();
  const { fetchCourses } = useCourses();
  const { fetchGroups } = useGroups();
  const { fetchSchedule } = useSchedule();
  const { initSchedule, addLesson } = useAuditorium();

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const loadAllData = async (): Promise<void> => {
    try {
      checkStore.isLoading = true;
      const completeData: CompleteStructureItem[] = [];

      for (const faculty of faculties.value) {
        await fetchFacultyForms(faculty);
        const forms = await fetchFacultyForms(faculty);

        for (const form of forms) {
          await fetchCourses(faculty);
          const courses = await fetchCourses(faculty);
          
          const coursesWithGroups = [];
          for (const course of courses) {
            const groups = await fetchGroups(faculty);
            coursesWithGroups.push({
              course,
              groups
            });
            await delay(300);
          }
          
          completeData.push({ faculty, form, courses: coursesWithGroups });
        }
      }
      
      checkStore.cache.completeStructure = completeData;
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

      for (const { faculty, courses } of checkStore.cache.completeStructure) {
        for (const { groups } of courses) {
          for (const group of groups) {
            const schedules = await fetchSchedule(faculty);
            if (Array.isArray(schedules)) { 
              allSchedules.push(...schedules);
            }
            await delay(300);
          }
        }
      }

      checkStore.cache.allLessons = allSchedules;
      return allSchedules;
    } finally {
      checkStore.isLoading = false;
    }
  };

  const initFullSchedule = async (nameCorpus: keyof typeof CORPUS_CONFIG): Promise<void> => {
    try {
      await initSchedule(CORPUS_CONFIG[nameCorpus], TIME_SLOTS);
      
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

      // Сохранение в localStorage
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

      // Добавление занятий
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