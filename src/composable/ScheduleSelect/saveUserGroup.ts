import { useScheduleCorrectStore } from "@/stores/getScheduleCorrectGroup";
import { storeToRefs } from "pinia";
import { ref } from "vue";
export default function useSaveUserGroup() {
  const formScheduleStore = useScheduleCorrectStore();
  const { correctFaculty, correctGroup, correctCourse, correctForm } =
    storeToRefs(formScheduleStore);

  const emit = defineEmits(["update-show-schedule", "correct-group"]);

  function saveUserGroup() {
    console.log("Сработало");
    const arrUserSchedule = ref({
      faculty: correctFaculty.value?.name,
      form: correctForm.value?.name,
      Course: correctCourse.value?.name,
      Group: correctGroup.value?.name,
    });
    localStorage.setItem("userGroup", JSON.stringify(arrUserSchedule.value));
    emit("correct-group", correctGroup.value?.name);
    emit("update-show-schedule", true);
  }
  return {
    saveUserGroup,
  };
}
