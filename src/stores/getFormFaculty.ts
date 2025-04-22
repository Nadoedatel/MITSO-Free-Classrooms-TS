import type { Faculty } from "@/types/faculty";
import type { Form } from "@/types/form";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { CompleteStructureItem } from "@/types/structure";


export const useFormFaculty = defineStore("formFaculty", () => {
  const arrForm = ref<Form[]>([]);
  const arrFaculty = ref<Faculty[]>([{"name":"Юридический"}, {"name":"Экономический"}, {"name":"Магистратура"}]);
  const nowFaculty = ref<Faculty | null>(null);
  const completeStructure = ref<CompleteStructureItem[]>([]);


  // Функция передачи из факультета, все формы обучения
  function deliveryToArr(data: Form[]): void {
    arrForm.value = [];
    
    for (const item of data) {
      arrForm.value.push(item);
    }
  }

  function setCurrentFaculty(facultyName?: string): void {
    if (facultyName) {
      const faculty = arrFaculty.value.find(fac => fac.name === facultyName);
      if (faculty) {
        nowFaculty.value = faculty;
      }
    } else if (arrFaculty.value.length > 0) {
      nowFaculty.value = arrFaculty.value[0];
    }
  }

  // Получение форм обучения данного факультета
  async function getFormFaculty(faculty: Faculty): Promise<void> {
    try {
      if (faculty) {
        setCurrentFaculty(faculty.name);
      } else if (!nowFaculty.value) {
        setCurrentFaculty();
      }
  
      if (!nowFaculty.value) {
        throw new Error("Не удалось установить факультет");
      }

      console.log(`Текущая форма факультета: ${nowFaculty.value.name}`);

      const response = await fetch(`/api/schedule/forms?faculty=${nowFaculty.value.name}`);
      const data: Form[] = await response.json();
      console.log("%c Формы обучения:", 'background: red', data);

      deliveryToArr(data);
    } catch (error) {
      console.error("Ошибка в useFormFaculty:", error);
    }
  }

  return {
    getFormFaculty,
    arrForm,
    setCurrentFaculty,
    arrFaculty,
    nowFaculty,
    completeStructure
  };
});
