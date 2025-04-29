<script setup>
import { ref } from 'vue';
import Header from './components/Header.vue';

const bgColor = ref('dark:bg-[#2f2f2f]');
const textColor = ref('text-black dark:text-white');
</script>

<template>
  <div :class="`min-h-screen ${bgColor} ${textColor}`">
    <Header></Header>
  </div>
</template>