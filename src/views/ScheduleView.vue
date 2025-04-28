<script setup>
import GroupData from "@/components/Schedule/GroupData.vue";
import ScheduleList from "@/components/Schedule/ScheduleList.vue";
import ScheduleSelector from "@/components/Schedule/ScheduleSelector.vue";
import { useScheduleGroup } from "@/stores/getScheduleGroup";
import { ref } from "vue";

const scheduleGroup = useScheduleGroup();
const showSchedule = ref(false);
const correctGroup = ref("")
</script>

<template>
  <GroupData
    :correctGroup="correctGroup"
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