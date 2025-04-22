<template>
  <div class="p-4 bg-gray-50 rounded-lg justify-items-center">
    <div class="grid grid-cols-1 gap-4 border rounded-lg p-4 bg-white text-center">
      <SelectedFaculty @select-faculty="select"></SelectedFaculty>
      <SelectedForm></SelectedForm>
      <AppButton @click="$emit('select-schedule')"> Добавить </AppButton>
    </div>
  </div>
</template>

<script setup>
import AppButton from "../UI/AppButton.vue";
import SelectedFaculty from "./SelectedFaculty.vue";
import SelectedForm from "./SelectedForm.vue";

function select(method) {
    if(method) {
        console.log(method)
        loadForm(method)
    }
}

defineEmits(["select-schedule"]);
</script>
