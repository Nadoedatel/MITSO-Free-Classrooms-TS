import { useScheduleGroup } from "@/stores/getScheduleGroup";
import { useUserDate } from "@/stores/getUserDate"
import { useAuditorium } from "@/stores/objectAuditorium"
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCheckBusyAuditorium = defineStore("checkBusyAuditorium", () => {
  const formScheduleStore = useScheduleGroup();
  const formUserDate = useUserDate()
  const formAuditoriumStore = useAuditorium()
  const isLoading = ref(false);

  // Инициализируем расписание
  const initFullSchedule = () => {
    const auditoriums = ["71", "72", "73", "74"];
    const timeSlots = [
      '08:00-09:25',
      '09:35-11:00', 
      '11:10-12:35',
      '13:05-14:30',
      '14:40-16:05',
      '16:35-18:00',
      '18:10-19:35',
      '19:45-21:10'
    ];
    formAuditoriumStore.initSchedule(auditoriums, timeSlots)
  }
  // Пример добавления занятия (реактивное изменение)
  const bookAuditorium = () => {
    console.log("Добавление занятия");
    
    formAuditoriumStore.addLesson("71", "08:00-09:25", {
      group: "2411 МН",
      subject: "Программирование"
    })
  }

  async function loadSchedule() {
    try {
      isLoading.value = true;
      formUserDate.getUserCurrentDate()
      await formScheduleStore.getScheduleGroup();
      console.log("Расписание загружено");
    } catch (error) {
      console.error("Ошибка загрузки расписания:", error);
      // Можно показать сообщение об ошибке пользователю
    } finally {
      isLoading.value = false;
    }
  }

  return {
    loadSchedule,
    initFullSchedule,
    bookAuditorium
  };
});
