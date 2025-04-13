<script setup>
import { useFormFaculty } from "@/stores/getFormFaculty";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useGroupOnCourse } from "@/stores/getGroupCourses"
import { useScheduleGroup } from "@/stores/getScheduleGroup"
import { useCheckBusyAuditorium } from "@/stores/checkBusyAuditorium"
import { useAuditorium } from "@/stores/objectAuditorium"


const auditoriumStore = useAuditorium()
const checkBusyAuditorium = useCheckBusyAuditorium()
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
    <button class="border-2 p-5" @click="checkBusyAuditorium.loadSchedule">Получить расписание сразу</button>
    <button class="border-2 p-5" @click="checkBusyAuditorium.initFullSchedule">Инициализация объекта аудитории</button>
  </div>
  <div
  @click="checkBusyAuditorium.bookAuditorium"
    :class="{
      'bg-red-700': false,
      'bg-green-700': true,
    }"
  >
    <p class="border-2 p-5">{{ auditoriumStore.bookAuditorium }}</p>
  </div>
</template>
