<template>
  <div class="p-4 bg-gray-50 rounded-lg justify-items-center">
    <div class="grid grid-cols-1 gap-4 border rounded-lg p-4 bg-white text-center">
      <SelectedFaculty @select-faculty="faculty"></SelectedFaculty>
      <SelectedForm @select-form="form"></SelectedForm>
      <SelectedCourse @select-course="course"></SelectedCourse>
      <SelectedGroup @select-group="group"></SelectedGroup>
      <AppButton @click="saveUserGroup">Добавить</AppButton>
    </div>
    <div>
      <ScheduleList></ScheduleList>
    </div>
  </div>
</template>

<script setup>
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import AppButton from "../UI/AppButton.vue";
import SelectedFaculty from "./SelectedItem/SelectedFaculty.vue";
import SelectedForm from "./SelectedItem/SelectedForm.vue";
import SelectedCourse from "./SelectedItem/SelectedCourse.vue";
import SelectedGroup from "./SelectedItem/SelectedGroup.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useGroupOnCourse } from "@/stores/getGroupCourses";
import { useScheduleGroup } from "@/stores/getScheduleGroup";
import { useAuditorium } from "@/stores/objectAuditorium";


const getForm = useFormFaculty()
const getCorse = useCoursesFaculty()
const getGroup = useGroupOnCourse()
const getSchedule = useScheduleGroup()
const nowFaculty = ref()

const auditoriumStore = useAuditorium();
const formFacultyStore = useCoursesFaculty();
const formGroupStore = useGroupOnCourse()
const formScheduleStore = useScheduleGroup()
const { nowForm } = storeToRefs(formFacultyStore);
const { nowCourse } = storeToRefs(formGroupStore)
const { nowGroup } = storeToRefs(formScheduleStore)


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

const loadCourse = async (faculty) => {
  try {
    await getCorse.getCourseFaculty(faculty)
  } catch (err) {
    console.error('Ошибка загрузки форм:', err);
  } finally {
    // isLoading.value = false;
  }
}

const loadGroup = async (faculty) => {
  try {
    await getGroup.getGroupCourse(faculty)
  } catch (err) {
    console.error('Ошибка загрузки форм:', err);
  } finally {
    // isLoading.value = false;
  }
}

const loadSchedule = async (faculty, isSchedule) => {
  try {
    await getSchedule.getScheduleGroup(faculty, isSchedule)
  } catch (err) {
    console.error('Ошибка загрузки форм:', err);
  } finally {
    // isLoading.value = false;
  }
}

function faculty(method) {
  nowFaculty.value = method
  console.log(method, nowFaculty.value)
  loadForm(nowFaculty.value)
}

function form(method) {
  nowForm.value = method
  console.log(method)
  loadCourse(nowFaculty.value)
}

function course(method) {
  nowCourse.value = method
  console.log(method)
  loadGroup(nowFaculty.value)
}

function group(method) {
  nowGroup.value = method
  console.log(method);
  loadSchedule(nowFaculty.value, true)
}

function saveUserGroup() {
  console.log("Сработало");
  const arrUserSchedule = ref([nowFaculty.value.name, nowForm.value.name, nowCourse.value.name, nowGroup.value.name])
  localStorage.setItem("userGroup", arrUserSchedule.value)
}
</script>
