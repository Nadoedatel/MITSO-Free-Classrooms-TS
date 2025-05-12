<script setup>
  import GroupData from "@/components/Schedule/GroupData.vue";
  import ScheduleList from "@/components/Schedule/ScheduleList.vue";
  import ScheduleSelector from "@/components/Schedule/ScheduleSelector.vue";
  import { useScheduleCorrectStore } from "@/stores/getScheduleCorrectGroup";
  import { ref } from "vue";

  const scheduleGroup = useScheduleCorrectStore();
  const showSchedule = ref(false);
  const showSelectorGroup = ref(false)
  const correctGroup = ref("");
</script>

<template>
  <div class="space-y-6 dark:bg-[#2f2f2f] dark:text-white">
    <GroupData
      class="dark:bg-[#2f2f2f] dark:text-white"
      :correctGroup="correctGroup"
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
