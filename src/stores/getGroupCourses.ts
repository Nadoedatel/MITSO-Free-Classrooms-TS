import type { Course } from "@/types/course";
import type { Group } from "@/types/group";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useGroup = defineStore("groupOnCourse", () => {
  const arrGroup = ref<Group[]>([]); 
  const nowCourse = ref<Course | null>(null);


  const setGroups = (groups: Group[]) => {
    arrGroup.value = groups;
  };

  const setCurrentCourse = (course?: Course) => {
    nowCourse.value = course || null;
  };


  return {
    arrGroup,
    nowCourse,
    setGroups,
    setCurrentCourse
  };
});
