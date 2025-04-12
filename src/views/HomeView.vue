<script setup>
import { useScheduleDataStore } from "@/stores/getAPI";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useGroupOnCourse } from "@/stores/getGroupCourses"
import { useScheduleGroup } from "@/stores/getScheduleGroup"
import { useCheckBusyAuditorium } from "@/stores/checkBusyAuditorium"
import { useUserDate } from "@/stores/getUserDate"

const getUserDate = useUserDate()
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
  </div>
  <div
    @click="checkBusyAuditorium.loadSchedule"
    :class="{
      'bg-red-700': false,
      'bg-green-700': true,
    }"
  >
    <p class="border-2 p-5">{{ getUserDate.classrooms }}</p>
  </div>
</template>
