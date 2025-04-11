<script setup>
import { useScheduleDataStore  } from '@/stores/getAPI'
const testPinia = useScheduleDataStore()
</script>

<template>
  <div>
    <button class="border-2 p-5" @click="testPinia.getFormOnFaculty">Получение форму обучения</button>
    <button class="border-2 p-5" @click="testPinia.getCourseOnFaculty">Получения курсов</button>
    <button class="border-2 p-5" @click="testPinia.getGroupOnCourse">Получения групп</button>
    <button class="border-2 p-5" @click="testPinia.getScheduleGroup">Получения расписание группы</button>
  </div>
    <div @click="testPinia.getUserCurrentDate()"  :class="
    {
      // 'bg-red-700': true,
      'bg-green-700': true
    }">
      <p class="border-2 p-5">{{ testPinia.classrooms }}</p>
    </div>
</template>
