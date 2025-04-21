import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserDate = defineStore("userDate", () => {
  const currentDate = ref<string>("");

  // Функция получения даты пользователя в данный момент
  function getUserCurrentDate(): void {
    const today = new Date();
    currentDate.value = formatDate(today);
    console.log(currentDate.value);
  }

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;;
  }

  return {
    getUserCurrentDate,
    currentDate
  };
});
