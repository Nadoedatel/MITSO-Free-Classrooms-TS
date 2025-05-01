import { useFormFaculty } from "@/stores/getFormFaculty";
import type { Faculty } from "@/types/faculty";
import type { Form } from "@/types/form";
import { computed } from "vue";

export default function useFacultyForms() {
  const store = useFormFaculty();
  
  // Получение форм обучения
  const fetchFacultyForms = async (faculty?: Faculty) => {
    try {
      const targetFaculty = faculty || store.nowFaculty || store.arrFaculty[0];
      
      if (!targetFaculty) {
        throw new Error("Не удалось определить факультет");
      }

      store.setCurrentFaculty(targetFaculty);
      
      const response = await fetch(`/api/schedule/forms?faculty=${targetFaculty.name}`);
      const forms: Form[] = await response.json();
      
      store.setForms(forms);
      return forms;
    } catch (error) {
      console.error("Ошибка загрузки форм обучения:", error);
      throw error;
    }
  };

  return {
    fetchFacultyForms,
    forms: computed(() => store.arrForm),
    faculties: computed(() => store.arrFaculty),
    currentFaculty: computed(() => store.nowFaculty)
  };
}