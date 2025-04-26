<script setup>
import ScheduleList from "@/components/Schedule/ScheduleList.vue";
import ScheduleSelector from "@/components/Schedule/ScheduleSelector.vue";
import { useScheduleGroup } from "@/stores/getScheduleGroup";

const test = useScheduleGroup()
</script>

<template>
  <ScheduleSelector></ScheduleSelector>
  <ScheduleList 
    :allInfoSchedule="test.allInfoSchedule"
    :hasData="Object.keys(test.allInfoSchedule).length > 0"
  ></ScheduleList>
</template>
