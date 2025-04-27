<template>
    <div class="justify-center flex">
        <div class="px-4 py-2 bg-white border border-gray-300 rounded-md justify-center flex">
            {{ userGroup }}
        </div>
    </div>
</template>

<script setup>
import { useScheduleGroup } from '@/stores/getScheduleGroup';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const formScheduleStore = useScheduleGroup()
const { nowGroup } = storeToRefs(formScheduleStore)

const userGroup = ref(nowGroup)
</script>