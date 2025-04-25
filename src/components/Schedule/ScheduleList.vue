<template>
    <div  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
      <ScheduleCard
        v-for="( schedule, auditorium) in allInfoSchedule"
        :key="auditorium"
        :schedule="schedule"
        :auditorium="auditorium"
        :date="date"
        :time="time"
      />
    </div>
    <!-- <div v-else class="p-6 text-center text-gray-500">
      Нет данных об аудиториях. Загрузите данные для одного из корпусов.
    </div> -->
  </template>
  
  <script setup>
  import { useScheduleGroup } from '@/stores/getScheduleGroup';
import ScheduleCard from './ScheduleCard.vue';
import { storeToRefs } from 'pinia';

  const formScheduleStore = useScheduleGroup()
  const { allInfoSchedule } = storeToRefs(formScheduleStore)
  </script>