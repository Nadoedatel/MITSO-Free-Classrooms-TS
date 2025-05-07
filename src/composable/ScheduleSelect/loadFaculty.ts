import type { Faculty } from "@/types/faculty";
import useFacultyForms from "../useFormFaculty";
import { ref } from "vue";
import { useScheduleCorrectStore } from "@/stores/getScheduleCorrectGroup";
import { storeToRefs } from "pinia";

export default function useLoadFaculty() {
  const getForm = useFacultyForms();
  const isLoading = ref(false);
  const error = ref(null);
  const formScheduleStore = useScheduleCorrectStore();
  const { correctFaculty } = storeToRefs(formScheduleStore);
  const loadForm = async (faculty: Faculty) => {
    try {
      isLoading.value = true;
      error.value = null;

      await getForm.fetchFacultyForms(faculty);
    } catch (err) {
      console.error("Ошибка загрузки форм:", error.value);
    } finally {
      isLoading.value = false;
    }
  };

  const handleFacultySelect = (faculty: Faculty) => {
    correctFaculty.value = faculty;
    console.log("Selected faculty:", faculty);
    loadForm(faculty);
  };
  return {
    handleFacultySelect,
    isLoading,
    correctFaculty,
  };
}
