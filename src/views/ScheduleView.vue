<script setup>
import GroupData from "@/components/Schedule/GroupData.vue";
import ScheduleList from "@/components/Schedule/ScheduleList.vue";
import ScheduleSelector from "@/components/Schedule/ScheduleSelector.vue";
import { useScheduleCorrectStore } from "@/stores/getScheduleCorrectGroup";
import { useStorage } from "@vueuse/core";
import { computed, ref } from "vue";

const defaultGroup = {
  faculty: "",
  form: "",
  Course: "",
  Group: "",
};

const storageGroup = useStorage("userGroup", defaultGroup);

const scheduleGroup = useScheduleCorrectStore();
const showSchedule = ref(false);
const showSelectorGroup = ref(false);
const correctGroup = computed({
  get: () => storageGroup.value.Group,
  set: (value) => {
    storageGroup.value.Group = value
  }
})
</script>

<template>
  <div class="space-y-6 dark:bg-[#2f2f2f] dark:text-white">
    <GroupData
      class="dark:bg-[#2f2f2f] dark:text-white"
      :correctGroup="correctGroup"
      :storageGroup="storageGroup"
      @update-show-schedule="(value) => (showSchedule = value)"
      @update-show-selector="(value) => (showSelectorGroup = value)"
    ></GroupData>
    <ScheduleSelector
      class="dark:bg-[#2f2f2f] dark:text-white"
      v-if="showSelectorGroup"
      @correct-group="(value) => (correctGroup = value)"
      @update-show-schedule="(value) => (showSchedule = value)"
      @update-show-selector="(value) => (showSelectorGroup = value)"
    ></ScheduleSelector>
    <ScheduleList
      class="dark:bg-[#2f2f2f] dark:text-white"
      :allInfoSchedule="scheduleGroup.allInfoSchedule"
      :hasData="showSchedule"
    />
  </div>
</template>
