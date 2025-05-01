import type { Faculty } from "@/types/faculty";
import type { Form } from "@/types/form";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { CompleteStructureItem } from "@/types/structure";

export const useFormFaculty = defineStore("formFaculty", () => {
  const arrForm = ref<Form[]>([]);
  const arrFaculty = ref<Faculty[]>([
    { name: "Юридический" },
    { name: "Экономический" },
    { name: "Магистратура" },
  ]);
  const nowFaculty = ref<Faculty | null>(null);
  const completeStructure = ref<CompleteStructureItem[]>([]);

  const setForms = (forms: Form[]) => {
    arrForm.value = forms;
  };

  const setCurrentFaculty = (faculty?: Faculty) => {
    nowFaculty.value = faculty || arrFaculty.value[0] || null;
  };

  return {
    setForms,
    arrForm,
    setCurrentFaculty,
    arrFaculty,
    nowFaculty,
    completeStructure,
  };
});
