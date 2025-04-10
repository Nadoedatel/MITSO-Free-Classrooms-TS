<script setup>
import { useScheduleDataStore  } from '@/stores/getAPI'
const testPinia = useScheduleDataStore()
</script>

<template>
  <div>
    <button class="border-2 p-5" @click="testPinia.getFormOnFaculty">Получение форму обучения</button>
    <button class="border-2 p-5" @click="testPinia.getCourseOnFaculty">Получения курсов</button>
  </div>
</template>
