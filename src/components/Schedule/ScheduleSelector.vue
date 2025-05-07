<script setup>
import AppButton from "../UI/AppButton.vue";
import SelectedFaculty from "./SelectedItem/SelectedFaculty.vue";
import SelectedForm from "./SelectedItem/SelectedForm.vue";
import SelectedCourse from "./SelectedItem/SelectedCourse.vue";
import SelectedGroup from "./SelectedItem/SelectedGroup.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import useScheduleCorrect from "@/composable/useScheduleCorrectGroup";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useGroupStore } from "@/stores/getGroupCourses";
import { useScheduleCorrectStore } from "@/stores/getScheduleCorrectGroup";
import useLoadFaculty from "@/composable/ScheduleSelect/loadFaculty";
import useLoadCourse from "@/composable/ScheduleSelect/loadCourse";
import useLoadGroup from "@/composable/ScheduleSelect/loadGroup";

const { handleFacultySelect } = useLoadFaculty();
const { handleFormSelect } = useLoadCourse();
const { handleCourseSelect } = useLoadGroup();
const { handleGroupSelect } = useLoadGroup();

const isLoading = ref(false);

const emit = defineEmits(["update-show-schedule", "correct-group"]);

const formFacultyStore = useCoursesFaculty();
const formGroupStore = useGroupStore();
const formScheduleStore = useScheduleCorrectStore();

const { nowForm } = storeToRefs(formFacultyStore);
const { nowCourse } = storeToRefs(formGroupStore);
const { correctGroup, correctCourse, correctForm } =
  storeToRefs(formScheduleStore);

defineProps({
  isLoading: Boolean,
});


function saveUserGroup() {
  console.log("Сработало");
  const arrUserSchedule = ref({
    faculty: nowFaculty.value.name,
    form: nowForm.value.name,
    Course: nowCourse.value.name,
    Group: correctGroup.value.name,
  });
  localStorage.setItem("userGroup", JSON.stringify(arrUserSchedule.value));
  emit("correct-group", correctGroup.value.name);
  emit("update-show-schedule", true);
}
</script>

<template>
  <div
    class="p-4 bg-gray-50 rounded-lg justify-items-center dark:bg-[#242424] dark:text-white"
  >
    <div
      class="grid grid-cols-1 gap-4 border rounded-lg p-6 bg-white text-center dark:bg-[#2f2f2f] dark:text-white"
    >
      <SelectedFaculty
        @select-faculty="handleFacultySelect"
        :disabled="isLoading"
      ></SelectedFaculty>
      <SelectedForm
        @select-form="handleFormSelect"
        :disabled="isLoading"
      ></SelectedForm>
      <SelectedCourse
        @select-course="handleCourseSelect"
        :disabled="isLoading"
      ></SelectedCourse>
      <SelectedGroup
        @select-group="handleGroupSelect"
        :disabled="isLoading"
      ></SelectedGroup>
      <AppButton @click="saveUserGroup" :disabled="isLoading"
        >Добавить</AppButton
      >
    </div>
  </div>
</template>
