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
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const apiUrl = await fetch(`https://apps.mitso.by/frontend/web/schedule/forms?faculty=${formFacultyStore.nowFaculty.name}`);
      const response = await fetch(proxyUrl + apiUrl, {
        headers: {
          "X-Requested-With": "XMLHttpRequest" // Чтобы CORS Anywhere разрешил запрос
        }
      });
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