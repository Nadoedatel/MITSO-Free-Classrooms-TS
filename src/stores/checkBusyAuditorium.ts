import type { Lesson } from "@/types/lesson";
import type { CompleteStructureItem } from "@/types/structure";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuditoriumCheckStore = defineStore("auditoriumCheck", () => {
  const isLoading = ref(false);
  const cache = ref<{
    allLessons: Lesson[];
    initialized: boolean;
    completeStructure: CompleteStructureItem[];
  }>({
    allLessons: [],
    initialized: false,
    completeStructure: []
  });

  return {
    isLoading,
    cache
  };
});