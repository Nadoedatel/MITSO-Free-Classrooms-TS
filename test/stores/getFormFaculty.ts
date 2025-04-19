import { defineStore } from "pinia";
import { ref } from "vue";
import type { EducationForm, Faculty } from "../types/schedule";

export const useFormFaculty = defineStore("formFaculty", () => {
  const arrFormOnFaculty = ref<EducationForm[]>([]);
  const arrFaculty = ref<Faculty[]>([{"name": "Юридический"}, {"name":"Экономический"}, {"name": "Магистратура"}])
  const nowFaculty = ref<Faculty | null>(null)

  // Функция передачи данных о формах обучения
  function deliveryToArr(data: EducationForm[]):void {
    arrFormOnFaculty.value = [...data];
  }

  // Установка текущего факультета
  function setCurrentFaculty(faculty?: Faculty):void {
    if (faculty && arrFaculty.value.includes(faculty)) {
      nowFaculty.value = faculty;
    } else if (arrFaculty.value.length > 0) {
      nowFaculty.value = arrFaculty.value[0];
    }
  }

  // Получение форм обучения факультета
  async function getFormOnFaculty(faculty:Faculty):Promise<void> {
    try {
      if (faculty) {
        setCurrentFaculty(faculty);
      } else if (!nowFaculty.value) {
        setCurrentFaculty();
      }

      if (!nowFaculty.value) {
        throw new Error("Не удалось установить текущий факультет");
      }

      console.log(`Текущая форма факультета: ${nowFaculty.value}`);

      const response = await fetch(`/api/schedule/forms?faculty=${nowFaculty.value}`);

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
    deliveryToArr,
    arrFaculty,
    nowFaculty
  };
});
