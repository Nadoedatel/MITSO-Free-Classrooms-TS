<script setup>
defineProps({
  auditorium: String,
  subject: String,
  teacher: String,
  time: String,
});
</script>

<template>
  <div
    v-if="subject"
    class="border rounded-lg bg-fuchsia-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
  >
    <div class="p-4">
      <!-- Основная информация -->
      <p class="font-medium text-gray-800">{{ subject }}</p>
      <p class="text-sm text-gray-600 mb-3">{{ time }}</p>

      <!-- Детали -->
      <div class="space-y-2 border-t pt-3 text-sm">
        <p v-if="teacher" class="flex items-center text-gray-700">
          <span class="mr-2">👤</span>
          {{ teacher }}
        </p>
        <p v-if="auditorium" class="flex items-center text-gray-700">
          <span class="mr-2">🏢</span>
          Ауд. {{ auditorium }}
        </p>
      </div>
    </div>
  </div>
</template>
