<template>
    <div class="justify-center flex gap-3 p-4">
        <div 
            @click="showSchedule" 
            class="px-4 py-2 bg-white border border-gray-300 rounded-md justify-center flex"
        >
            {{ userGroups.Group || "Группа не выбрана" }}
        </div>
        <AppButton @click="saveUserGroup">Добавить группу</AppButton>
    </div>
</template>

<script setup>
import { useStorage } from '@vueuse/core';
import AppButton from '../UI/AppButton.vue';

// 1. Определяем структуру по умолчанию
const defaultGroup = {
  faculty: "",
  form: "",
  Course: "",
  Group: ""
}

const props = defineProps({
    correctGroup: String,
});

const userGroups = useStorage('userGroup', defaultGroup)

function saveUserGroup() {
//   userGroup.value = {
//     faculty: nowFaculty.value.name,
//     form: nowForm.value.name,
//     Course: nowCourse.value.name,
//     Group: nowGroup.value.name
//   }
//   emit("update-show-schedule", true)
}



// function changeHasUserGroup() {
//     emit("update-show-schedule", false);
// }
</script>