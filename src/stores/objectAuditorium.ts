import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

interface LessonData {
  id: string,
  date: string,
  auditorium: string,
  time: string,
  group_class: string,
}

interface TimeSlotSchedule {
  [timeSlot:string]: LessonData | null
}

interface AuditoriumSchedule {
  [auditorium: string]: TimeSlotSchedule
}

export const useAuditorium = defineStore("auditorium", () => {
  const fullSchedule: Ref<AuditoriumSchedule> = ref({})

  // Инициализация пустого расписания
  function initSchedule(auditoriums: string[], timeSlots: string[]): void {
    console.log("Инициализация с параметрами:", { auditoriums, timeSlots })
    fullSchedule.value = auditoriums.reduce((acc: AuditoriumSchedule, aud: string) => {
      acc[aud] = timeSlots.reduce((timeAcc: TimeSlotSchedule, time: string) => {
        timeAcc[time] = null
        return timeAcc
      }, {})
      return acc
    }, {})
    console.log("Результат инициализации:", JSON.parse(JSON.stringify(fullSchedule.value)))
  }
  
  // Добавить занятия в аудиторию
  function addLesson(auditorium: string, timeSlot: string, lessonData: LessonData): void {
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
