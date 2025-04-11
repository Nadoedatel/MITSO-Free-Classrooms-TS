<script setup>
import { useScheduleDataStore } from "@/stores/getAPI";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
const testPinia = useScheduleDataStore();

const getCourseFaculty = useCoursesFaculty();
const getFormsStuding = useFormFaculty();
</script>

<template>
  <div>
    <button class="border-2 p-5" @click="getFormsStuding.getFormOnFaculty">
      Получение форму обучения
    </button>
    <button class="border-2 p-5" @click="getCourseFaculty.getCourseFaculty">
      Получения курсов
    </button>
    <button class="border-2 p-5" @click="testPinia.getGroupOnCourse">
      Получения групп
    </button>
    <button class="border-2 p-5" @click="testPinia.getScheduleGroup">
      Получения расписание группы
    </button>
  </div>
  <div
    @click="testPinia.getUserCurrentDate()"
    :class="{
      'bg-red-700': false,
      'bg-green-700': true,
    }"
  >
    <p class="border-2 p-5">{{ testPinia.classrooms }}</p>
  </div>
</template>
