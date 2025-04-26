<template>
  <div class="border rounded-lg p-6 bg-white shadow-sm">
    <h3 class="text-xl font-bold mb-4">Дата {{ date }}</h3>
    <p>Группа: {{ group_class }}</p>
    <p>Предмет: {{ subject }}</p>
    <p>Преподаватель: {{ teacher }}</p>
    <p>Аудитория: {{ auditorium }}</p>
    <p>Время: {{ time }}</p>
  </div>
</template>

<script setup>
defineProps({
  auditorium: String,
  date: String,
  group_class: String,
  subject: String,
  teacher: String,
  time: String
})
</script>