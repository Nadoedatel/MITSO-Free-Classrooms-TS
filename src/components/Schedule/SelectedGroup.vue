<template>
    <select v-model="selectedGroup" @change="$emit('select-form', selectedGroup)"
        class="border rounded-lg p-4 bg-white text-center">
        <option selected disabled hidden :value="null">Группа</option>
        <option v-for="group in arrGroup" :key="group.name" :value="group"
            class="border rounded-lg p-4 bg-white text-center">
            {{ group.name }}
        </option>
    </select>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useGroupOnCourse } from "@/stores/getGroupCourses";
import { ref } from "vue";

const selectedGroup = ref(null);

const formCourseStore = useGroupOnCourse();
const { arrGroup } = storeToRefs(formCourseStore);

defineEmits(["select-form"]);
</script>
