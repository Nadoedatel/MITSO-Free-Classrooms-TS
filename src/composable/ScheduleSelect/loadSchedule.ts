import type { Faculty } from "@/types/faculty";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useScheduleCorrectStore } from "@/stores/getScheduleCorrectGroup";
import type { Group } from "@/types/group";
import useScheduleCorrect from "../useScheduleCorrectGroup";

export default function useLoadGroup() {
  const isLoading = ref(false);
  const getSchedule = useScheduleCorrect();
  const formScheduleStore = useScheduleCorrectStore();
  const { correctFaculty,  correctGroup } = storeToRefs(formScheduleStore);
  const loadSchedule = async (faculty: Faculty, isSchedule: boolean) => {
    try {
      isLoading.value = true;

      await getSchedule.fetchSchedule(faculty, isSchedule);
    } catch (err) {
      console.error("Ошибка загрузки форм:");
    } finally {
      isLoading.value = false;
    }
  };
  
  
  function handleGroupSelect(group: Group) {
    correctGroup.value = group;
    console.log(group);
    if (!correctFaculty.value) {
        console.warn("Факультет не выбран");
        return;
      }
    loadSchedule(correctFaculty.value, true);
  }
  return {
    handleGroupSelect,
    loadSchedule,
    isLoading,
  };
}
