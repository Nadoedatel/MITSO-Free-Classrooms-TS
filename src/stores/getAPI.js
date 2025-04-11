import { defineStore } from "pinia";
import { ref } from "vue";

export const useScheduleDataStore = defineStore("scheduleData", () => {
  const currentDate = ref("");
  const isBusy = ref(false);
  const classrooms = ref("71");

  // Функция получения даты пользователя в данный момент
  function getUserCurrentDate() {
    const today = new Date();
    currentDate.value = formatDate(today);
    console.log(currentDate.value);
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

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
    getUserCurrentDate,
    classrooms,
    isBusy,
  };
});
