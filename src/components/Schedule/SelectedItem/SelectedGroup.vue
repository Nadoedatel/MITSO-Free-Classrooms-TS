<template>
  <select
    v-model="selectedGroup"
    @change="$emit('select-group', selectedGroup)"
    class="border rounded-lg p-4 bg-white text-center dark:bg-[#242424] dark:text-white"
    :disabled="disabled"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
  >
    <option selected disabled hidden :value="null">Группа</option>
    <option
      v-for="group in arrGroup"
      :key="group.name"
      :value="group"
    >
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
defineProps({
    disabled: Boolean
  })
defineEmits(["select-group"]);
</script>
