<template>
    <button
      :disabled="disabled"
      class="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-blue-700 hover:text-white transition-colors"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
      @click="$emit('click')"
    >
      <slot></slot>
    </button>
  </template>
  
  <script setup>
  defineProps({
    disabled: Boolean
  })
  defineEmits(['click'])
  </script>