import type { Faculty } from "@/types/faculty";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useScheduleCorrectStore } from "@/stores/getScheduleCorrectGroup";
import type { Group } from "@/types/group";
import useScheduleCorrect from "../useScheduleCorrectGroup";

export default function useLoadSchedule() {
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

  function group(correctDateGroup: any) {
  getSchedule.setFaculty({ name: correctDateGroup.faculty });
  getSchedule.setForm({ id: correctDateGroup.form, name: correctDateGroup.form });
  getSchedule.setCourse({ id: correctDateGroup.Course, name: correctDateGroup.Course });
  getSchedule.setGroup({ id: correctDateGroup.Group, name: correctDateGroup.Group });
  if (!correctFaculty.value) {
    console.warn("Факультет не выбран");
    return;
  }
  loadSchedule(correctFaculty.value, true);
}
  
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
    group
  };
}
