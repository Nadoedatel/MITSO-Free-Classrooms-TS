<script setup>
import ScheduleSelector from "@/components/Schedule/ScheduleSelector.vue";
import { useFormFaculty } from "@/stores/getFormFaculty";

const getForm = useFormFaculty()

const loadForm = async (faculty) => {
  try {
    // isLoading.value = true;
    // error.value = null;

    await getForm.getFormFaculty(faculty)
  } catch (err) {
    // error.value = err.message;
    console.error('Ошибка загрузки форм:', err);
  } finally {
    // isLoading.value = false;
  }
};

function select(method) {
    if(method) {
        console.log(method)
        loadForm(method)
    }
}
</script>

<template>
  <ScheduleSelector @select-schedule="select"></ScheduleSelector>
</template>
