<script setup>
import useLoadSchedule from "@/composable/ScheduleSelect/loadSchedule";
import { useStorage } from "@vueuse/core";
import AppButton from "../UI/AppButton.vue";

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


const emit = defineEmits(["update-show-schedule", "update-show-selector"]);
emit("update-show-schedule", true);

const updateShowSelector = () => {
  emit("update-show-selector", true)
}
</script>

<template>
  <div class="justify-center flex gap-3 p-4 dark:bg-[#242424] dark:text-white">
    <div
      @click="group(userGroups)"
      class="px-4 py-2 bg-white border dark:bg-[#2f2f2f] dark:text-white border-gray-300 rounded-md justify-center flex hover:bg-blue-700 hover:text-white transition-colors cursor-pointer"
    >
      {{ userGroups.Group || "Группа не выбрана" }}
    </div>
    <AppButton v-if="group" @click="updateShowSelector">
      Добавить группу
    </AppButton>
  </div>
</template>
