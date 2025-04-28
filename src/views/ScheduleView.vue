<script setup>
import GroupData from "@/components/Schedule/GroupData.vue";
import ScheduleList from "@/components/Schedule/ScheduleList.vue";
import ScheduleSelector from "@/components/Schedule/ScheduleSelector.vue";
import { useScheduleCorrectGroup } from "@/stores/getScheduleCorrectGroup";
import { ref } from "vue";

const scheduleGroup = useScheduleCorrectGroup();
const showSchedule = ref(false);
const correctGroup = ref("")
</script>

<template>
  <GroupData
    :correctGroup="correctGroup"
    @update-show-schedule="(value) => showSchedule = value"
  ></GroupData>
  <ScheduleSelector
    @correct-group="(value) => correctGroup = value"
    @update-show-schedule="(value) => showSchedule = value"
  ></ScheduleSelector>
  <ScheduleList 
    :allInfoSchedule="scheduleGroup.allInfoSchedule"
    :hasData="showSchedule"
  />
</template>