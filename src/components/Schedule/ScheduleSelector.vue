<template>
  <div class="p-4 bg-gray-50 rounded-lg justify-items-center">
    <div
      class="grid grid-cols-1 gap-4 border rounded-lg p-4 bg-white text-center"
    >
      <select
        v-model="selectedFaculty"
        @change="$emit('select-schedule', selectedFaculty)"
        class="border rounded-lg p-4 bg-white text-center"
      >
        <option selected disabled hidden  :value="null">Факультет</option>
        <option
          v-for="faculty in arrFaculty"
          :key="faculty.name"
          :value="faculty"
          class="border rounded-lg p-4 bg-white text-center"
        >
          {{ faculty.name }}
        </option>
      </select>

      <select
        v-model="selectedForm"
        @change="$emit('select-schedule', selectedForm)"
        class="border rounded-lg p-4 bg-white text-center"
      >
        <option selected disabled hidden  :value="null">Форма обучения</option>
        <option
          v-for="form  in arrForm"
          :key="form.name"
          :value="form"
          class="border rounded-lg p-4 bg-white text-center"
        >
          {{ form.name }}
        </option>
      </select>

      <AppButton @click="$emit('select-schedule')"> Добавить </AppButton>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import AppButton from "../UI/AppButton.vue";
import { useFormFaculty } from "@/stores/getFormFaculty";
import { ref } from "vue";

const selectedFaculty = ref(null);
const selectedForm = ref(null);



const formFacultyStore = useFormFaculty();
const { arrForm, arrFaculty } = storeToRefs(formFacultyStore);

defineEmits(["select-schedule"]);
</script>
