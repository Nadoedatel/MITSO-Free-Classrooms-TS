<script setup>
import { storeToRefs } from "pinia";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { ref } from "vue";

const selectedFaculty = ref(null);

const formFacultyStore = useFormFaculty();
const { arrFaculty } = storeToRefs(formFacultyStore);
defineProps({
  disabled: Boolean,
});
defineEmits(["select-faculty"]);
</script>

<template>
  <select
    v-model="selectedFaculty"
    @change="$emit('select-faculty', selectedFaculty)"
    class="border rounded-lg p-4 bg-white text-center w-64 dark:bg-[#242424] dark:text-white"
    :disabled="disabled"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
  >
    <option selected disabled hidden :value="null">Факультет</option>
    <option v-for="faculty in arrFaculty" :key="faculty.name" :value="faculty">
      {{ faculty.name }}
    </option>
  </select>
</template>
