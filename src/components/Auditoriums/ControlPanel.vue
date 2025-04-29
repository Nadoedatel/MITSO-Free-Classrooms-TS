<template>
    <div class="flex flex-wrap gap-3  p-4 bg-gray-50 rounded-lg">
      <AppButton
        v-for="(action, index) in actions"
        :key="index"
        @click="$emit('action', action.method)"
        :disabled="isLoading"
      >
        {{ action.label }}
      </AppButton>
      <AppInput></AppInput>

    </div>
  </template>
  
  <script setup>
import AppButton from '../UI/AppButton.vue';
import AppInput from '../UI/AppInput.vue';

  defineProps({
    isLoading: Boolean,
    actions: {
      type: Array,
      default: () => [
        { label: 'Инициализация аудиторий', method: 'init' }, 
        { label: 'Очистка Local Storage', method: 'clear' }
      ]
    }
  })
  
  defineEmits(['action'])
  </script>