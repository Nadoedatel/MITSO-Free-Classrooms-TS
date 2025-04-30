<script setup>
import { ref, onMounted } from "vue";

const isDark = ref(false);

onMounted(() => {
  const savedMode = localStorage.getItem("darkMode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  isDark.value = savedMode ? JSON.parse(savedMode) : prefersDark;
  updateTheme();
});

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  updateTheme();
  localStorage.setItem("darkMode", isDark.value);
};

const updateTheme = () => {
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
