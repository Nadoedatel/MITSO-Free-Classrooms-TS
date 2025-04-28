<template>
  <div class="justify-center flex gap-3 p-4">
    <div
      @click="group(userGroups)"
      class="px-4 py-2 bg-white border border-gray-300 rounded-md justify-center flex hover:bg-blue-700 hover:text-white transition-colors cursor-pointer"
    >
      {{ userGroups.Group || "Группа не выбрана" }}
    </div>
    <AppButton @click="saveUserGroup">Добавить группу</AppButton>
  </div>
</template>

<script setup>
import { useStorage } from "@vueuse/core";
import AppButton from "../UI/AppButton.vue";
import { useScheduleGroup } from "@/stores/getScheduleGroup";
import { storeToRefs } from "pinia";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useGroupOnCourse } from "@/stores/getGroupCourses";
import { ref } from "vue";
import { useScheduleCorrectGroup } from "@/stores/getScheduleCorrectGroup";

// 1. Определяем структуру по умолчанию
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
const getSchedule = useScheduleCorrectGroup();

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

    await getSchedule.getScheduleCorrectGroup({name: faculty}, isSchedule);
  } catch (err) {
    error.value = err.message;
    console.error("Ошибка загрузки форм:", err);
  } finally {
    isLoading.value = false;
  }
};

function group(correctDateGroup) {
  getSchedule.setCurrentForm({name: correctDateGroup.form})
  getSchedule.setCurrentCourse({name: correctDateGroup.Course})
  getSchedule.setCurrentGroup({name: correctDateGroup.Group})
  loadSchedule(correctDateGroup.faculty, true);
  emit("update-show-schedule", true);
}

// function changeHasUserGroup() {
//     emit("update-show-schedule", false);
// }
</script>
