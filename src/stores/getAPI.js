
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScheduleDataStore = defineStore('scheduleData', () => {
  const faculty = ref('')
  const form = ref('')
  const course = ref('')
  const group = ref('')

  const arrFormOnFaculty = ref([])
  const nowFormOnFaculty = ref('')

// Функция передачи из факультета, все формы обучения
  function deliveryToArr(data) {
    for (let i = 0; i < data.length; i++) {
      arrFormOnFaculty.value.push(data[i])
    }
    console.log(arrFormOnFaculty.value);
  }

// Функция передачи в getCourseOnFaculty форму обучения
  function deliveryToCourseOnFaculty(nowFormRef) {
    for (let i = 0; i < arrFormOnFaculty.value.length; i++) {
      if (nowFormRef.value !== arrFormOnFaculty.value[i]) {
        nowFormRef.value = arrFormOnFaculty.value[i]
      }
    }
  }

// Получения курсов данного факультета и данной формы обучения ( Экономический, дневная )
  async function getCourseOnFaculty() {
    try {
      deliveryToCourseOnFaculty(nowFormOnFaculty)
      console.log(nowFormOnFaculty.value);
      
      const response = await fetch(`/api/schedule/courses?faculty=Экономический&form=${nowFormOnFaculty.value.name}`)
      const data = await response.json()
      console.log(data);
      
    } catch (error) {
      console.error('Ошибка в getCourseOnFaculty:', error)
    }
  }

// Получение форму обучения данного факультета
  async function getFormOnFaculty() {
    try {
      const response = await fetch('/api/schedule/forms?faculty=Экономический')
      const data = await response.json()
      console.log(data)
      
      if (arrFormOnFaculty.value.length === 0) {
        deliveryToArr(data)
      }
      
    } catch (error) {
      console.error('Ошибка в useScheduleDataStore:', error)
    }
  }

  

  async function getApiScheduleMitso() {
    try {
      const response = await fetch('/api/schedule/group-schedules?faculty=Экономический&form=Дневная&course=2 курс&group=2321 ИСИТ')
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error('Ошибка в useScheduleDataStore:', error)
    }
  }

  return {
    getApiScheduleMitso,
    getFormOnFaculty,
    getCourseOnFaculty
  }
})
