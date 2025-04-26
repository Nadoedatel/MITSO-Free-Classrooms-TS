import type { Auditorium } from "@/types/auditorium";
import type { Lesson } from "@/types/lesson";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSchedule = defineStore("schedule", () => {
  const fullSchedule = ref<Auditorium>({});

  // Инициализация пустого расписания
  function initSchedule(auditoriums: string[], timeSlots: string[]): void {
    console.log("Инициализация с параметрами:", { auditoriums, timeSlots });

    const schedule: Auditorium = auditoriums.reduce((acc, aud) => {
      acc[aud] = timeSlots.reduce((timeAcc, time) => {
        timeAcc[time] = null;
        return timeAcc;
      }, {} as Record<string, Auditorium | null>);
      return acc;
    }, {} as Auditorium);

    fullSchedule.value = schedule;
  }

  // Добавить занятие
  function addLesson(auditorium: string, timeSlot: string, lessonData: Lesson): void {
    console.log("%c Занятия которые мы собираемся передать:", 'background: blue', { auditorium, timeSlot, lessonData });
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
