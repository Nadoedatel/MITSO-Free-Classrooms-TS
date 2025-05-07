<script setup>
import useLoadSchedule from "@/composable/ScheduleSelect/loadSchedule";
import { useStorage } from "@vueuse/core";

const defaultGroup = {
  faculty: "",
  form: "",
  Course: "",
  Group: "",
};

const props = defineProps({
  correctGroup: String,
});

const userGroups = useStorage("userGroup", defaultGroup);
const { group } = useLoadSchedule();

const emit = defineEmits(["update-show-schedule"]);
emit("update-show-schedule", true);
</script>

<template>
  <div class="justify-center flex gap-3 p-4 dark:bg-[#242424] dark:text-white">
    <div
      @click="group(userGroups)"
      class="px-4 py-2 bg-white border dark:bg-[#2f2f2f] dark:text-white border-gray-300 rounded-md justify-center flex hover:bg-blue-700 hover:text-white transition-colors cursor-pointer"
    >
      {{ userGroups.Group || "Группа не выбрана" }}
    </div>
  </div>
</template>
