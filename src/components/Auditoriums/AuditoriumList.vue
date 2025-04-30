<script setup>
import AuditoriumCard from "./AuditoriumCard.vue";

defineProps({
  fullSchedule: Object,
  hasData: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    v-if="hasData"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4"
  >
    <AuditoriumCard
      v-for="(schedule, auditorium) in fullSchedule"
      :key="auditorium"
      :auditorium="auditorium"
      :schedule="schedule"
    />
  </div>
  <div v-else class="p-6 text-center text-gray-500">
    Нет данных об аудиториях. Загрузите данные для одного из корпусов.
  </div>
</template>
