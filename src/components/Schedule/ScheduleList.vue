<template>
  <div
    v-if="hasData"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4"
  >
    <ScheduleCard
      v-for="(item, index) in allInfoSchedule"
      :key="index"
      :group_class="item.group_class"
      :subject="item.subject"
      :teacher="item.teacher"
      :auditorium="item.auditorium"
      :date="item.date"
      :time="item.time"
    />
  </div>
  <div v-else class="p-6 text-center text-gray-500">
    Нет данных о расписании.
  </div>
</template>

<script setup>
import ScheduleCard from "./ScheduleCard.vue";
defineProps({
  allInfoSchedule: Array,
  hasData: {
      type: Boolean,
      default: false
    }
})

</script>
