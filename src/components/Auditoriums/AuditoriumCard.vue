<template>
    <div class="border rounded-lg p-6 bg-white shadow-sm">
      <h3 class="text-xl font-bold mb-4">Аудитория {{ auditorium }}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-3">
        <div 
          v-for="(lesson, time) in schedule" 
          :key="time" 
          class="border rounded p-3 transition-all hover:shadow-md hover:shadow-blue-400"
          :class="{
            'bg-red-200 border-red-200 hover:shadow-red-400': lesson,
            'bg-gray-100 border-gray-300': !lesson
          }"
        >
          <div class="text-sm font-medium text-gray-500 mb-1">{{ time }}</div>
          <template v-if="lesson">
            <div class="font-medium text-gray-800">{{ lesson.group }}</div>
            <div v-if="lesson.subject" class="text-sm text-gray-600 mt-1">
              {{ lesson.subject }}
            </div>
          </template>
          <div v-else class="text-gray-400 italic text-sm">Свободно</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    auditorium: String,
    schedule: Object
  })
  </script>