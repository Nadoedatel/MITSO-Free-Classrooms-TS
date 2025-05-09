import { useFormFaculty } from "@/stores/getFormFaculty";
import type { Faculty } from "@/types/faculty";
import type { Form } from "@/types/form";
import { computed } from "vue";

export default function useFacultyForms() {
  const formFacultyStore = useFormFaculty();
  
  // Получение форм обучения
  const fetchFacultyForms = async (faculty?: Faculty) => {
    try {
      if(faculty) {
        formFacultyStore.setCurrentFaculty(faculty)
      } else if (!formFacultyStore.nowFaculty?.name) {
        formFacultyStore.setCurrentFaculty()
      }
      
      if (!formFacultyStore.nowFaculty?.name) {
        throw new Error("Не удалось определить факультет");
      }
      
      const response = await fetch(`https://mitso-free-classrooms-ts.onrender.com/api/schedule/forms?faculty=${formFacultyStore.nowFaculty.name}`);
      const forms: Form[] = await response.json();
      
      formFacultyStore.setForms(forms);
    } catch (error) {
      console.error("Ошибка загрузки форм обучения:", error);
      throw error;
    }
  };

  return {
    fetchFacultyForms,
    forms: computed(() => formFacultyStore.arrForm),
    faculties: computed(() => formFacultyStore.arrFaculty),
    currentFaculty: computed(() => formFacultyStore.nowFaculty)
  };
}