import type { AllLesson } from "@/types/allLesson";
import type { Group } from "@/types/group";
import type { Lesson } from "@/types/lesson";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useScheduleGroup = defineStore("scheduleGroup", () => {
  const nowGroup = ref<Group | null>(null);
  const arrSchedule = ref<Lesson[]>([]);
  const allInfoSchedule = ref<AllLesson>([]);

  const setSchedule = (lessons: Lesson[]) => {
    arrSchedule.value = lessons;
  };

  const setFullSchedule = (lessons: AllLesson) => {
    allInfoSchedule.value = lessons;
  };

  const setCurrentGroup = (group?: Group) => {
    nowGroup.value = group || null;
  };

  return {
    nowGroup,
    arrSchedule,
    allInfoSchedule,
    setSchedule,
    setFullSchedule,
    setCurrentGroup,
  };
});
