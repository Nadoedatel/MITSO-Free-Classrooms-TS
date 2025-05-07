import type { Faculty } from "@/types/faculty";
import type { Form } from "@/types/form";
import { ref } from "vue";
import useCourses from "../useCoursesFaculty";
import { storeToRefs } from "pinia";
import { useScheduleCorrectStore } from "@/stores/getScheduleCorrectGroup";

export default function useLoadCourse() {
  const isLoading = ref(false);
  const getCorse = useCourses();
  const formScheduleStore = useScheduleCorrectStore();
  const { correctForm, correctFaculty } = storeToRefs(formScheduleStore);
  const loadCourse = async (faculty: Faculty) => {
    try {
      await getCorse.fetchCourses(faculty);
    } catch (err) {
      console.error("Ошибка загрузки форм:");
    } finally {
      isLoading.value = false;
    }
  };
  const handleFormSelect = (form: Form) => {
    correctForm.value = form;
    console.log(form);
    if (!correctFaculty.value) {
      console.warn("Факультет не выбран");
      return;
    }
    loadCourse(correctFaculty.value);
  };
  return {
    handleFormSelect,
    loadCourse,
    isLoading,
  };
}
