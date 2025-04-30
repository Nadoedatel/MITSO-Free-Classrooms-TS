<script setup>
defineProps({
  disabled: Boolean,
});
defineEmits(["click"]);
</script>

<template>
  <button
    :disabled="disabled"
    class="px-4 py-2 bg-white border dark:bg-[#2f2f2f] dark:text-white border-gray-300 rounded-md hover:bg-blue-700 hover:text-white transition-colors"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    @click="$emit('click')"
  >
    <slot>Veronika</slot>
  </button>
</template>
