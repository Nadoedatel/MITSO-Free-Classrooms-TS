<script setup>
import { useStorage } from "@vueuse/core";
import AppButton from "../UI/AppButton.vue";
import { ref } from "vue";
import useScheduleCorrect from "@/composable/useScheduleCorrectGroup";

const defaultGroup = {
  faculty: "",
  form: "",
  Course: "",
  Group: "",
};

const props = defineProps({
  correctGroup: String,
});

const userGroups = useStorage("userGroup", defaultGroup);
const getSchedule = useScheduleCorrect();

const emit = defineEmits(["update-show-schedule"]);

const isLoading = ref(false);
const error = ref(null);

function saveUserGroup() {
  //   userGroup.value = {
  //     faculty: nowFaculty.value.name,
  //     form: nowForm.value.name,
  //     Course: nowCourse.value.name,
  //     Group: nowGroup.value.name
  //   }
  //   emit("update-show-schedule", true)
}

const loadSchedule = async (faculty, isSchedule) => {
  try {
    isLoading.value = true;
    error.value = null;

    await getSchedule.fetchSchedule({ name: faculty }, isSchedule);
  } catch (err) {
    error.value = err.message;
    console.error("Ошибка загрузки форм:", err);
  } finally {
    isLoading.value = false;
  }
};

function group(correctDateGroup) {
  getSchedule.setForm({ name: correctDateGroup.form });
  getSchedule.setCourse({ name: correctDateGroup.Course });
  getSchedule.setGroup({ name: correctDateGroup.Group });
  loadSchedule(correctDateGroup.faculty, true);
  emit("update-show-schedule", true);
}

// function changeHasUserGroup() {
//     emit("update-show-schedule", false);
// }
</script>

<template>
  <div class="justify-center flex gap-3 p-4 dark:bg-[#242424] dark:text-white">
    <div
      @click="group(userGroups)"
      class="px-4 py-2 bg-white border dark:bg-[#2f2f2f] dark:text-white border-gray-300 rounded-md justify-center flex hover:bg-blue-700 hover:text-white transition-colors cursor-pointer"
    >
      {{ userGroups.Group || "Группа не выбрана" }}
    </div>
    <AppButton class="dark:bg-[#2f2f2f] dark:text-white" @click="saveUserGroup"
      >Добавить группу</AppButton
    >
  </div>
</template>
