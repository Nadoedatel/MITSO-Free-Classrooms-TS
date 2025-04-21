<script setup>
import { RouterLink, RouterView } from 'vue-router'
import AppButton from './UI/AppButton.vue';
</script>

<template>
    <div class="flex gap-5 p-5 justify-center">
        <AppButton><RouterLink to="/">Аудиторий</RouterLink></AppButton>
        <AppButton><RouterLink to="/about">Расписание</RouterLink></AppButton>
    </div>
  <RouterView />
</template>

<style scoped>
</style>
