<script setup>
import { RouterLink, RouterView } from 'vue-router'
import AppButton from './UI/AppButton.vue';
import SwitchTheme from './UI/SwitchTheme.vue';
</script>

<template>
    <div class=" dark:bg-[#242424] dark:text-white flex gap-5 p-5 justify-center">
        <AppButton class="dark:bg-[#2f2f2f] dark:text-white"><RouterLink to="/">Аудиторий</RouterLink></AppButton>
        <AppButton class="dark:bg-[#2f2f2f] dark:text-white"><RouterLink to="/schedule">Расписание</RouterLink></AppButton>
        <SwitchTheme class="dark:bg-[#2f2f2f] dark:text-white"></SwitchTheme>
    </div>
  <RouterView />
</template>

<style scoped>
</style>
