
import { defineStore } from 'pinia'
import {  ref } from 'vue'

export const useScheduleDataStore = defineStore('scheduleData', () => {
  const nowFormOnFaculty = ref('')
  const arrGroup = ref([])
  const nowNameGroup = ref('')
  const arrCourses = ref([])
  const nowCourseOnFormAndFaculty = ref('')
  const arrSchedule = ref([])

  const currentDate = ref('');
  const isBusy = ref(false)
  const classrooms = ref('71')

// Фунция занят или нет кабинет


// Функция получения даты пользователя в данный момент
function getUserCurrentDate() {
  const today = new Date();
  currentDate.value = formatDate(today);
  console.log(currentDate.value);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}






// Функция передачи в getGroupOnCourse курса ( 1 курс к примеру и тд )
  function deliveryToGroupOnCourse(nowCourseRef) {
    for (let i = 0; i < arrCourses.value.length; i++) {
      if (nowCourseRef.value !== arrCourses.value[i]) {
        nowCourseRef.value = arrCourses.value[i]
      }
    }
  }

// Функция создания массива групп из курса и  факультета и формы обучения ( 4 курс, Экономический, Заочная сокращенная)
function deliveryGroupToArr(data) {
  for (let i = 0; i < data.length; i++) {
    arrGroup.value.unshift(data[i])
  }
  console.log(arrGroup.value);
}

// Функция передачи названия группы в getScheduleGroup ( 2121зс МН )
function deliveryGroupForSchedule(nowGroup) {
  for (let i = 0; i < arrGroup.value.length; i++) {
    if (nowGroup.value !== arrGroup.value[i]) {
      nowGroup.value = arrGroup.value[i]
    }
  }
}

// Функция создания массива групп из курса и  факультета и формы обучения ( 4 курс, Экономический, Заочная сокращенная)
function deliveryScheduleInArr(data) {
      // Перебираем все недели
    Object.values(data).forEach((week) => {
      // Перебираем все дни в неделе
      Object.entries(week).forEach(([dateKey, dayLessons]) => {
        // Перебираем все пары в дне
        dayLessons.forEach((lesson) => {
          // Если subject не пустой (чтобы отфильтровать пустые пары)
          if (lesson.subject && lesson.subject.trim() !== '') {
            arrSchedule.value.push({
              id: lesson.id,
              date: dateKey,
              auditorium: lesson.auditorium,
              time: lesson.time,
              group_class: lesson.group_class,
            });
          }
        });
      });
    });
console.log(arrSchedule.value);
}

// Получения расписания групп( 4 курс, Экономический, Заочная сокращенная, 2121зс МН)
async function getScheduleGroup() {
  try {
    deliveryGroupForSchedule(nowNameGroup)
    console.log(`Какая сейчас группа: ${nowNameGroup.value.name}`);
    
    const response = await fetch(`/api/schedule/group-schedules?faculty=Экономический&form=${nowFormOnFaculty.value.name}&course=${nowCourseOnFormAndFaculty.value.name}&group=${nowNameGroup.value.name}`)
    const data = await response.json()
    console.log(data);
    
    if (arrSchedule.value.length === 0) {
      deliveryScheduleInArr(data)
    }
    
  } catch (error) {
    console.error('Ошибка в getCourseOnFaculty:', error)
  }
}  

// Получения групп данного курса ( Экономический, дневная, 1 курс )
  async function getGroupOnCourse() {
    try {
      deliveryToGroupOnCourse(nowCourseOnFormAndFaculty)
      console.log(`Какой сейчас курс: ${nowCourseOnFormAndFaculty.value.name}`);
      
      const response = await fetch(`/api/schedule/groups?faculty=Экономический&form=${nowFormOnFaculty.value.name}&course=${nowCourseOnFormAndFaculty.value.name}`)
      const data = await response.json()

      if (arrGroup.value.length === 0) {
        deliveryGroupToArr(data)
      }
      
    } catch (error) {
      console.error('Ошибка в getCourseOnFaculty:', error)
    }
  }  

// Получения курсов данного факультета и данной формы обучения ( Экономический, дневная )
  async function getCourseOnFaculty() {
    try {
      deliveryToCourseOnFaculty(nowFormOnFaculty)
      console.log(`Какая сейчас форма обучения: ${nowFormOnFaculty.value.name}`);
      
      const response = await fetch(`/api/schedule/courses?faculty=Экономический&form=${nowFormOnFaculty.value.name}`)
      const data = await response.json()
      
      if (arrCourses.value.length === 0) {
        deliveryCourseToArr(data)
      }
      
    } catch (error) {
      console.error('Ошибка в getCourseOnFaculty:', error)
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
    getGroupOnCourse,
    getScheduleGroup,
    getUserCurrentDate,
    classrooms,
    isBusy
  }
})
