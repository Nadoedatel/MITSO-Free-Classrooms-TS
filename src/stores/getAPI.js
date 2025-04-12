import { defineStore } from "pinia";
import { ref } from "vue";

export const useScheduleDataStore = defineStore("scheduleData", () => {
  const currentDate = ref("");
  const isBusy = ref(false);
  const classrooms = ref("71");


  async function getApiScheduleMitso() {
    try {
      const response = await fetch(
        "/api/schedule/group-schedules?faculty=Экономический&form=Дневная&course=2 курс&group=2321 ИСИТ"
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Ошибка в useScheduleDataStore:", error);
    }
  }

  return {
    getApiScheduleMitso,
  };
});
