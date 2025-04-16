import { defineStore } from "pinia";
import { ref } from "vue";

export const useFormFaculty = defineStore("formFaculty", () => {
  const arrFormOnFaculty = ref([]);
  const arrFaculty = ref(["Юридический", "Экономический"])
  const nowFaculty = ref("")
  // Функция передачи из факультета, все формы обучения
  function deliveryToArr(data) {
    arrFormOnFaculty.value = [];

    for (const item of data) {
      arrFormOnFaculty.value.push(item);
    }
    console.log(arrFormOnFaculty.value);
  }

  function setCurrentFaculty(faculty) {
    if (faculty && arrFaculty.value.includes(faculty)) {
      nowFaculty.value = faculty;
    } else if (arrFaculty.value.length > 0) {
      nowFaculty.value = arrFaculty.value[0];
    }
  }

  // Получение форму обучения данного факультета
  async function getFormOnFaculty(faculty = null) {
    try {
      if (faculty) {
        setCurrentFaculty(faculty);
      } else if (!nowFaculty.value) {
        setCurrentFaculty();
      }

      if (!nowFaculty.value) {
        throw new Error("Не удалось установить форму обучения");
      }

      console.log(`Текущая форма факультета: ${nowFaculty.value}`);

      const response = await fetch(`/api/schedule/forms?faculty=${nowFaculty.value}`);
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
    setCurrentFaculty,
    arrFaculty,
    setCurrentFaculty
  };
});
