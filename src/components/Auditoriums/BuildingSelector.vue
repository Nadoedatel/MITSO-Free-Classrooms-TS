<template>
    <div class="grid  grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
      <div 
        v-for="building in buildings" 
        :key="building.type" 
        class="border dark:bg-[#2f2f2f] dark:text-white rounded-lg p-4 bg-white text-center"
      >
        <h3 class="font-medium mb-2">{{ building.label }}</h3>
        <AppButton
          @click="$emit('select-building', building.type)"
          :disabled="isLoading"
        >
          Получить аудитории
        </AppButton>
      </div>
    </div>
  </template>
  
  <script setup>
import AppButton from '../UI/AppButton.vue';

  defineProps({
    isLoading: Boolean,
    buildings: {
      type: Array,
      default: () => [
        { type: 'auditoriumsInNewCorpus', label: 'Новый корпус' },
        { type: 'auditoriumsInOldCorpus', label: 'Старый корпус' },
        { type: 'auditoriumsInDormitory', label: 'Общага' }
      ]
    }
  })
  
  defineEmits(['select-building'])
  </script>