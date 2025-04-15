import { defineStore } from "pinia";

export const useScheduleDataStore = defineStore("scheduleData", () => {
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
