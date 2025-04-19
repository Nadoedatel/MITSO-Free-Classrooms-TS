import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import type { AuditoriumMap, Lesson } from "@/types/schedule";

export const useAuditorium = defineStore("auditorium", () => {
  const fullSchedule: Ref<AuditoriumMap> = ref({})

  // Инициализация пустого расписания
  function initSchedule(auditoriums: string[], timeSlots: string[]): void {
    fullSchedule.value = auditoriums.reduce<AuditoriumMap>((acc, aud) => {
      acc[aud] = timeSlots.reduce((timeAcc, time) => {
        timeAcc[time] = null
        return timeAcc
      }, {} as Record<string, Lesson | null>)
      return acc
    }, {})
    console.log("Результат инициализации:", JSON.parse(JSON.stringify(fullSchedule.value)))
  }
  
  // Добавить занятия в аудиторию
  function addLesson(auditorium: string, timeSlot: string, lessonData: Lesson): void {
    if (fullSchedule.value[auditorium]) {
      console.log("Занятия которые мы собираеся передать:", { auditorium, timeSlot, lessonData });
      fullSchedule.value[auditorium][timeSlot] = lessonData
    }
  }

  
  return {
    fullSchedule,
    initSchedule,
    addLesson
  };
});
