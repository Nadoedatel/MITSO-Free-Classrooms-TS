import { defineStore } from "pinia";
import { ref } from "vue";

interface LessonData {
  id?: number;
  subject?: string;
  time?: string;
  auditorium?: string;
  [key: string]: any;
}

type Schedule = {
  [auditorium: string]: {
    [timeSlot: string]: LessonData | null;
  };
};

export const useAuditorium = defineStore("auditorium", () => {
  const fullSchedule = ref<Schedule>({});

  // Инициализация пустого расписания
  function initSchedule(auditoriums: string[], timeSlots: string[]): void {
    console.log("Инициализация с параметрами:", { auditoriums, timeSlots });

    const schedule: Schedule = auditoriums.reduce((acc, aud) => {
      acc[aud] = timeSlots.reduce((timeAcc, time) => {
        timeAcc[time] = null;
        return timeAcc;
      }, {} as Record<string, LessonData | null>);
      return acc;
    }, {} as Schedule);

    fullSchedule.value = schedule;

    console.log("Результат инициализации:", JSON.parse(JSON.stringify(fullSchedule.value)));
  }

  // Добавить занятие
  function addLesson(auditorium: string, timeSlot: string, lessonData: LessonData): void {
    console.log("Занятия которые мы собираемся передать:", { auditorium, timeSlot, lessonData });
    console.log(fullSchedule.value);

    if (fullSchedule.value[auditorium]) {
      console.log("Добавили занятие");
      fullSchedule.value[auditorium][timeSlot] = lessonData;
    }
  }

  return {
    fullSchedule,
    initSchedule,
    addLesson,
  };
});
