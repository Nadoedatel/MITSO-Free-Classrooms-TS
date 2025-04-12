import { useScheduleGroup } from "@/stores/getScheduleGroup";
import { useUserDate } from "@/stores/getUserDate"
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCheckBusyAuditorium = defineStore("checkBusyAuditorium", () => {
  const formScheduleStore = useScheduleGroup();
  const formUserDate = useUserDate()
  const isLoading = ref(false);


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
  };
});
