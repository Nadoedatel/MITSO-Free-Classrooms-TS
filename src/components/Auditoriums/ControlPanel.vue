<script setup lang="ts">
import AppButton from "../UI/AppButton.vue";

interface Action {
  label: string;
  method: string;
}

interface Props {
  isLoading?: boolean;
  actions?: Action[];
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  actions: () => [
    { label: "Инициализация аудиторий", method: "init" },
    { label: "Очистка Local Storage", method: "clear" },
  ],
});

const emit = defineEmits<{
  (e: 'action', method: string): void;
}>();
</script>

<template>
  <div class="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg">
    <AppButton
      v-for="(action, index) in actions"
      :key="index"
      @click="emit('action', action.method)"
      :disabled="isLoading"
    >
      {{ action.label }}
    </AppButton>
  </div>
</template>