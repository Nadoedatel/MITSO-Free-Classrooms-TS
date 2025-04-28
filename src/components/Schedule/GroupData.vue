<template>
    <div class="justify-center flex gap-3">
        <div 
        @click="showSchedule" 
        class="px-4 py-2 bg-white border border-gray-300 rounded-md justify-center flex">
            {{ groupName }}
        </div>
        <AppButton @click="changeHasUserGroup">Добавить группу</AppButton>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import AppButton from '../UI/AppButton.vue';

const groupName = ref('');

function extractGroupName(fullGroup) {
    if (!fullGroup) return '';
    
    const parts = fullGroup.split(',');
    const groupPart = parts[parts.length - 1].trim();
    
    return groupPart;
}

onMounted(() => {
    const userGroup = localStorage.getItem("userGroup");
    groupName.value = extractGroupName(userGroup);
});
</script>