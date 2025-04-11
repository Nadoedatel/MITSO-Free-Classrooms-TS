<script setup>
import { useScheduleDataStore } from "@/stores/getAPI";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useGroupOnCourse } from "@/stores/getGroupCourses"
import { useScheduleGroup } from "@/stores/getScheduleGroup"
const testPinia = useScheduleDataStore();

const getScheduleGroup = useScheduleGroup()
const getGroupCourses = useGroupOnCourse()
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
    <button class="border-2 p-5" @click="getGroupCourses.getGroupOnCourse">
      Получения групп
    </button>
    <button class="border-2 p-5" @click="getScheduleGroup.getScheduleGroup">
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
