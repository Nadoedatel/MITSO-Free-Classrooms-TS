import type { Faculty } from "@/types/faculty";
import type { Form } from "@/types/form";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useFormFaculty = defineStore("formFaculty", () => {
  const arrFormOnFaculty = ref<Form[]>([{"id": "", "name": ""}]);
  const arrFaculty = ref<Faculty[]>([{"name":"Юридический"}, {"name":"Экономический"}, {"name":"Магистратура"}]);
  const nowFaculty = ref<Faculty>({"name": ""});

  // Функция передачи из факультета, все формы обучения
  function deliveryToArr(data: Form[]): void {
    arrFormOnFaculty.value = [];

    for (const item of data) {
      arrFormOnFaculty.value.push(item);
    }

    console.log(arrFormOnFaculty.value);
  }

  function setCurrentFaculty(faculty?: string): void {
    if (faculty && arrFaculty.value.some(fac => fac.name === faculty)) {
      nowFaculty.value.name = faculty;
    } else if (arrFaculty.value.length > 0) {
      nowFaculty.value = arrFaculty.value[0];
    }
  }

  // Получение форм обучения данного факультета
  async function getFormOnFaculty(faculty: Faculty): Promise<void> {
    try {
      if (faculty) {
        setCurrentFaculty(faculty.name);
      }
  
      if (!nowFaculty.value) {
        throw new Error("Не удалось установить факультет");
      }

      console.log(`Текущая форма факультета: ${nowFaculty.value.name}`);

      const response = await fetch(`/api/schedule/forms?faculty=${nowFaculty.value.name}`);
      const data: Form[] = await response.json();
      console.log("Какие есть формы обучения?", data);

      if (arrFormOnFaculty.value.length === 0) {
        deliveryToArr(data);
      }
    } catch (error) {
      console.error("Ошибка в useFormFaculty:", error);
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
