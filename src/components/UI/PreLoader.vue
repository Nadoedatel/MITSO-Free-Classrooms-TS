<script setup lang="ts">
interface Props {
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});
</script>

<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90"
  >
    <div
      class="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-300 flex items-center justify-center"
    >
      <img src="/src/assets/logoMitso.png" alt="Loading..." class="h-16 w-16" />
    </div>
  </div>
</template>
