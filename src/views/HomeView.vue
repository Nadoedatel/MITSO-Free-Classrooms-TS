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
</script>

<template>
  <div>
    <button
      class="border-2 p-5 hover:bg-amber-400"
      @click="getFormsStuding.getFormOnFaculty"
    >
      Получение форму обучения
    </button>
    <button
      class="border-2 p-5 hover:bg-amber-400"
      @click="getCourseFaculty.getCourseFaculty"
    >
      Получения курсов
    </button>
    <button
      class="border-2 p-5 hover:bg-amber-400"
      @click="getGroupCourses.getGroupOnCourse"
    >
      Получения групп
    </button>
    <button
      class="border-2 p-5 hover:bg-amber-400"
      @click="getScheduleGroup.getScheduleGroup"
    >
      Получения расписание группы
    </button>
    <button
      class="border-2 p-5 hover:bg-amber-400"
      @click="checkBusyAuditorium.loadSchedule"
    >
      Получить расписание сразу
    </button>
    <button
      class="border-2 p-5 hover:bg-amber-400"
      @click="checkBusyAuditorium.initFullSchedule"
    >
      Инициализация объекта аудитории
    </button>
  </div>

  <div class="flex justify-around border-2 p-5">
    <div>
      <p class="border-2 p-5">Новый корпус</p>
      <button
        @click="checkBusyAuditorium.initFullSchedule('auditoriumsInNewCorpus')"
        class="border-2 p-5 hover:bg-amber-400"
      >
        Получить аудитории
      </button>
    </div>
    <div>
      <p class="border-2 p-5">Старый корпус</p>
      <button
        @click="checkBusyAuditorium.initFullSchedule('auditoriumsInOldCorpus')"
        class="border-2 p-5 hover:bg-amber-400"
      >
        Получить аудитории
      </button>
    </div>
    <div>
      <p class="border-2 p-5">Общага</p>
      <button
        @click="checkBusyAuditorium.initFullSchedule('auditoriumsInDormitory')"
        class="border-2 p-5 hover:bg-amber-400"
      >
        Получить аудитории
      </button>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-5">
    <div
      v-for="(schedule, auditorium) in auditoriumStore.fullSchedule"
      :key="auditorium"
      class="border rounded-lg p-6 bg-white shadow-sm"
    >
      <h3 class="text-xl font-bold mb-4">Аудитория {{ auditorium }}</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
        <div
          v-for="(lesson, time) in schedule"
          :key="time"
          class="border rounded p-3 transition-colors hover:shadow-md"
          :class="{ 'bg-green-50': lesson, 'bg-gray-50': !lesson }"
        >
          <div class="text-sm font-medium text-gray-500 mb-1">{{ time }}</div>
          <div v-if="lesson" class="space-y-1">
            <div class="group font-medium">{{ lesson.group }}</div>
            <div class="subject text-sm">{{ lesson.subject }}</div>
          </div>
          <div v-else class="text-gray-400 italic">Свободно</div>
        </div>
      </div>
    </div>
  </div>
</template>
