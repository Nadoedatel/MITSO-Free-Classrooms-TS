import { defineStore } from "pinia";
import { ref } from "vue";

export const useFormFaculty = defineStore("formFaculty", () => {
  const arrFormOnFaculty = ref([]);

  // Функция передачи из факультета, все формы обучения
  function deliveryToArr(data) {
    arrFormOnFaculty.value = [];

    for (const item of data) {
      arrFormOnFaculty.value.push(item);
    }
    console.log(arrFormOnFaculty.value);
  }

  // Получение форму обучения данного факультета
  async function getFormOnFaculty() {
    try {
      const response = await fetch("/api/schedule/forms?faculty=Экономический");
      const data = await response.json();
      console.log("Какие есть форму обучения?", data);

      if (arrFormOnFaculty.value.length === 0) {
        deliveryToArr(data);
      }
    } catch (error) {
      console.error("Ошибка в useScheduleDataStore:", error);
    }
  }

  return {
    getFormOnFaculty,
    arrFormOnFaculty,
  };
});
