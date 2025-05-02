import type { Course } from "@/types/course";
import type { Group } from "@/types/group";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useGroupStore = defineStore("group", () => {
  const arrGroup = ref<Group[]>([]);
  const nowCourse = ref<Course | null>(null);

  const setGroups = (groups: Group[]):void => {
    arrGroup.value = groups;
  };

  const setCurrentCourse = (course: Course): void => {
    nowCourse.value = course || null 
  };

  return {
    arrGroup,
    nowCourse,
    setGroups,
    setCurrentCourse,
  };
});