<script setup>
import GroupData from "@/components/Schedule/GroupData.vue";
import ScheduleList from "@/components/Schedule/ScheduleList.vue";
import ScheduleSelector from "@/components/Schedule/ScheduleSelector.vue";
import { useScheduleGroup } from "@/stores/getScheduleGroup";
import { ref } from "vue";

const scheduleGroup = useScheduleGroup();
const showSchedule = ref(false);
</script>

<template>
  <GroupData></GroupData>
  <ScheduleSelector
    @update-show-schedule="(value) => showSchedule = value"
  ></ScheduleSelector>
  <ScheduleList 
    :allInfoSchedule="scheduleGroup.allInfoSchedule"
    :hasData="showSchedule"
  />
</template>