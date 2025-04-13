<script setup>
import { useFormFaculty } from "@/stores/getFormFaculty";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useGroupOnCourse } from "@/stores/getGroupCourses";
import { useScheduleGroup } from "@/stores/getScheduleGroup";
import { useCheckBusyAuditorium } from "@/stores/checkBusyAuditorium";
import { useAuditorium } from "@/stores/objectAuditorium";

const auditoriumStore = useAuditorium();
const checkBusyAuditorium = useCheckBusyAuditorium();
const getScheduleGroup = useScheduleGroup();
const getGroupCourses = useGroupOnCourse();
const getCourseFaculty = useCoursesFaculty();
const getFormsStuding = useFormFaculty();

const auditoriumMeta = {
  "71": { name: "Компьютерный класс", capacity: 25 },
  "72": { name: "Лекционная", capacity: 50 },
  "105": { name: "Физическая лаборатория", capacity: 20 }
}

const getAuditoriumMeta = (auditorium) => {
  return auditoriumMeta[auditorium] || null
}
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
    <button class="border-2 p-5" @click="checkBusyAuditorium.loadSchedule">
      Получить расписание сразу
    </button>
    <button class="border-2 p-5" @click="checkBusyAuditorium.initFullSchedule">
      Инициализация объекта аудитории
    </button>
  </div>
  <div
    @click="checkBusyAuditorium.bookAuditorium"
    :class="{
      'bg-red-300': false,
      'bg-green-300': true,
    }"
  >
  <div class="space-y-8">
    <div v-for="(schedule, auditorium) in auditoriumStore.fullSchedule" 
         :key="auditorium"
         class="border rounded-lg p-6 bg-white shadow-sm">
      <h3 class="text-xl font-bold mb-4 flex items-center">
        <span class="inline-block w-10">№{{ auditorium }}</span>
        <span class="text-sm font-normal text-gray-500 ml-2">
          ({{ getAuditoriumMeta(auditorium)?.name || 'Аудитория' }})
        </span>
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div v-for="(lesson, time) in schedule" 
             :key="time"
             class="border rounded p-3 transition-colors hover:shadow-mdt"
             :class="{ 'bg-green-50': lesson, 'bg-gray-50': !lesson }">
          <div class="text-sm font-medium text-gray-500 mb-1">{{ time }}</div>
          <div v-if="lesson" class="space-y-1">
            <div class="group font-medium">{{ lesson.group }}</div>
            <div class="subject text-sm">{{ lesson.subject }}</div>
            <div v-if="lesson.teacher" class="teacher text-xs text-gray-500">
              {{ lesson.teacher }}
            </div>
          </div>
          <div v-else class="text-gray-400 italic">Свободно</div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
