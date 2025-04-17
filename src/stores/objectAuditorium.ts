import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuditorium = defineStore("auditorium", () => {
  const fullSchedule = ref({})

  // Инициализация пустого расписания
  function initSchedule(auditoriums, timeSlots) {
    console.log("Инициализация с параметрами:", { auditoriums, timeSlots })
    fullSchedule.value = auditoriums.reduce((acc, aud) => {
      acc[aud] = timeSlots.reduce((timeAcc, time) => {
        timeAcc[time] = null
        return timeAcc
      }, {})
      return acc
    }, {})
    console.log("Результат инициализации:", JSON.parse(JSON.stringify(fullSchedule.value)))
  }
  
  // Добавить занятие
  function addLesson(auditorium, timeSlot, lessonData) {
    console.log("Занятия которые мы собираеся передать:", { auditorium, timeSlot, lessonData });
    console.log(fullSchedule.value);
    if (fullSchedule.value[auditorium]) {
      console.log("Добавили занятие");
      
      fullSchedule.value[auditorium][timeSlot] = lessonData
    }
  }

  
  return {
    fullSchedule,
    initSchedule,
    addLesson
  };
});
