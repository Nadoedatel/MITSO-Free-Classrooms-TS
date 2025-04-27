<script setup>
import GroupData from "@/components/Schedule/GroupData.vue";
import ScheduleList from "@/components/Schedule/ScheduleList.vue";
import ScheduleSelector from "@/components/Schedule/ScheduleSelector.vue";
import { useScheduleGroup } from "@/stores/getScheduleGroup";

const scheduleGroup = useScheduleGroup();
</script>

<template>
  <ScheduleSelector></ScheduleSelector>
  <GroupData></GroupData>
  <ScheduleList 
    :allInfoSchedule="scheduleGroup.allInfoSchedule"
    :hasData="Object.keys(scheduleGroup.allInfoSchedule).length > 0"
  ></ScheduleList>
</template>