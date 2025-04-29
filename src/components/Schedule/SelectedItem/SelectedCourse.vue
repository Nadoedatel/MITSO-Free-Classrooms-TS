<template>
  <select
    v-model="selectedCourse"
    @change="$emit('select-course', selectedCourse)"
    class="border rounded-lg p-4 bg-white text-center dark:bg-[#242424] dark:text-white"
    :disabled="disabled"
    :class="{ 'bg-gray-400 opacity-50 cursor-not-allowed': disabled }"
  >
    <option selected disabled hidden :value="null">Курсы</option>
    <option
      v-for="course in arrCourses"
      :key="course.name"
      :value="course"
    >
      {{ course.name }}
    </option>
  </select>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { ref } from "vue";

const selectedCourse = ref(null);

const formFacultyStore = useCoursesFaculty();
const { arrCourses } = storeToRefs(formFacultyStore);
defineProps({
    disabled: Boolean
  })
defineEmits(["select-course"]);
</script>
