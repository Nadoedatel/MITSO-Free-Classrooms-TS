<script setup>
import useCourses from "@/composable/useCoursesFaculty";
import AppButton from "../UI/AppButton.vue";
import SelectedFaculty from "./SelectedItem/SelectedFaculty.vue";
import SelectedForm from "./SelectedItem/SelectedForm.vue";
import SelectedCourse from "./SelectedItem/SelectedCourse.vue";
import SelectedGroup from "./SelectedItem/SelectedGroup.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import useGroups from "@/composable/useGroupCourse";  
import useScheduleCorrect from "@/composable/useScheduleCorrectGroup";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useGroupStore } from "@/stores/getGroupCourses";
import { useScheduleCorrectStore } from "@/stores/getScheduleCorrectGroup";
import useLoadFaculty  from "@/composable/ScheduleSelect/loadFaculty"

const { handleFacultySelect } = useLoadFaculty();

const getCorse = useCourses();
const getGroup = useGroups();
const getSchedule = useScheduleCorrect();
const isLoading = ref(false);
const error = ref(null);

const emit = defineEmits(["update-show-schedule", "correct-group"]);

const formFacultyStore = useCoursesFaculty();
const formGroupStore = useGroupStore();
const formScheduleStore = useScheduleCorrectStore()

const { nowForm } = storeToRefs(formFacultyStore);
const { nowCourse } = storeToRefs(formGroupStore);
const { correctGroup, correctCourse, correctForm } = storeToRefs(formScheduleStore);

defineProps({
  isLoading: Boolean,
});


const loadCourse = async (faculty) => {
  try {
    isLoading.value = true;
    error.value = null;

    await getCorse.fetchCourses(faculty);
  } catch (err) {
    error.value = err.message;
    console.error("Ошибка загрузки форм:", err);
  } finally {
    isLoading.value = false;
  }
};

const loadGroup = async (faculty) => {
  try {
    isLoading.value = true;
    error.value = null;

    await getGroup.fetchGroups(faculty);
  } catch (err) {
    error.value = err.message;
    console.error("Ошибка загрузки форм:", err);
  } finally {
    isLoading.value = false;
  }
};

const loadSchedule = async (faculty, isSchedule) => {
  try {
    isLoading.value = true;
    error.value = null;

    await getSchedule.fetchSchedule(faculty, isSchedule);
  } catch (err) {
    error.value = err.message;
    console.error("Ошибка загрузки форм:", err);
  } finally {
    isLoading.value = false;
  }
};


function form(method) {
  nowForm.value = method;
  correctForm.value = method;
  console.log(method);
  loadCourse(nowFaculty.value);
}

function course(method) {
  nowCourse.value = method;
  correctCourse.value = method;
  console.log(method);
  loadGroup(nowFaculty.value);
}

function group(method) {
  correctGroup.value = method;
  console.log(method);
  loadSchedule(nowFaculty.value, true);
}

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
  <div class="p-4 bg-gray-50 rounded-lg justify-items-center dark:bg-[#242424] dark:text-white">
    <div class="grid grid-cols-1 gap-4 border rounded-lg p-6 bg-white text-center dark:bg-[#2f2f2f] dark:text-white">
      <SelectedFaculty @select-faculty="handleFacultySelect" :disabled="isLoading"></SelectedFaculty>
      <SelectedForm @select-form="form" :disabled="isLoading"></SelectedForm>
      <SelectedCourse @select-course="course" :disabled="isLoading"></SelectedCourse>
      <SelectedGroup @select-group="group" :disabled="isLoading"></SelectedGroup>
      <AppButton @click="saveUserGroup" :disabled="isLoading">Добавить</AppButton>
    </div>
  </div>
</template>
