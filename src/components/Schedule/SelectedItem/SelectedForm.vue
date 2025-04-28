<template>
  <select
    v-model="selectedForm"
    @change="$emit('select-form', selectedForm)"
    class="border rounded-lg p-4 bg-white text-center"
  >
    <option selected disabled hidden :value="null">Форма обучения</option>
    <option
      v-for="form in arrForm"
      :key="form.name"
      :value="form"
    >
      {{ form.name }}
    </option>
  </select>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { ref } from "vue";

const selectedForm = ref(null);

const formFacultyStore = useFormFaculty();
const { arrForm } = storeToRefs(formFacultyStore);

defineEmits(["select-form"]);
</script>
