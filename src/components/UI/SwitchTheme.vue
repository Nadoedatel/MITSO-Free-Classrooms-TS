<script setup lang="ts">
import { ref, onMounted } from "vue";

const isDark = ref<boolean>(false);

onMounted(() => {
  const savedMode: string | null = localStorage.getItem("darkMode");
  const prefersDark: boolean = window.matchMedia("(prefers-color-scheme: dark)").matches;

  isDark.value = savedMode ? JSON.parse(savedMode) as boolean : prefersDark;
  updateTheme();
});

const toggleDarkMode = (): void => {
  isDark.value = !isDark.value;
  updateTheme();
  localStorage.setItem("darkMode", JSON.stringify(isDark.value));
};

const updateTheme = (): void => {
  if (isDark.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};
</script>

<template>
  <button
    class="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-blue-700 hover:text-white transition-colors"
    @click="toggleDarkMode"
  >
    <span> {{ isDark ? "Светлая" : "Темная" }} тема </span>
  </button>
</template>
