import { defineStore } from "pinia";
import { ref } from "vue";
import type { EducationForm, Faculty } from "@/types/schedule";

export const useFormFaculty = defineStore("formFaculty", () => {
  const arrFormOnFaculty = ref<EducationForm[]>([]);
  const arrFaculty = ref<Faculty[]>([{"name": "Юридический"}, {"name":"Экономический"}, {"name": "Магистратура"}])
  const nowFaculty = ref<Faculty | null>(null)

  // Функция передачи данных о формах обучения
  function deliveryToArr(data: EducationForm[]):void {
    arrFormOnFaculty.value = [...data];
  }

  // Установка текущего факультета
  function setCurrentFaculty(faculty?: Faculty): void {  
    if (faculty) {  
      const exists = arrFaculty.value.some(f => f.name === faculty.name);  
      nowFaculty.value = exists ? faculty : arrFaculty.value[0];  
    } else {  
      nowFaculty.value = arrFaculty.value[0];  
    }  
  }  

  // Получение форм обучения факультета
  async function getFormOnFaculty(faculty:Faculty):Promise<void> {
    try {
      setCurrentFaculty(faculty);  

      if (!nowFaculty.value) {  
        throw new Error("Не удалось установить текущий факультет");  
      } 


      console.log(`Текущая форма факультета: ${nowFaculty.value.name}`);

      const response = await fetch(`/api/schedule/forms?faculty=${nowFaculty.value.name}`);

      if (!response.ok) {
        throw new Error(`HTTP error! статус: ${response.status}`);
      }

      const data:EducationForm[] = await response.json();

      if (arrFormOnFaculty.value.length === 0) {
        deliveryToArr(data);
      }
    } catch (error) {
      console.error("Ошибка при получение форм обучения:", error instanceof Error ? error.message : String(error));
    }
  }

  return {
    getFormOnFaculty,
    arrFormOnFaculty,
    setCurrentFaculty,
    arrFaculty,
    nowFaculty
  };
});
