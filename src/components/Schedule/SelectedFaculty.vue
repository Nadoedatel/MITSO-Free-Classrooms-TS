<template>
    <select v-model="selectedFaculty" @change="$emit('select-faculty', selectedFaculty)"
        class="border rounded-lg p-4 bg-white text-center">
        <option selected disabled hidden :value="null">Факультет</option>
        <option v-for="faculty in arrFaculty" :key="faculty.name" :value="faculty"
            class="border rounded-lg p-4 bg-white text-center">
            {{ faculty.name }}
        </option>
    </select>

</template>

<script setup>
import { storeToRefs } from "pinia";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { ref } from "vue";

const selectedFaculty = ref(null);

const formFacultyStore = useFormFaculty();
const { arrFaculty } = storeToRefs(formFacultyStore);

defineEmits(["select-faculty"]);
</script>
