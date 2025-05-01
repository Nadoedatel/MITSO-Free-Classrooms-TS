<script setup lang="ts">
import AppButton from "../UI/AppButton.vue";

// Явно указываем возможные методы
type ActionMethod = 'init' | 'clear';

interface Action {
  label: string;
  method: ActionMethod; // Теперь только 'init' или 'clear'
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
  ] as Action[] // Явное приведение типа
});

const emit = defineEmits<{
  (e: 'action', method: ActionMethod): void; // Строгий тип для метода
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