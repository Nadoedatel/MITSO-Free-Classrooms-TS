<template>
  <div class="p-4 bg-gray-50 rounded-lg justify-items-center">
    <div class="grid grid-cols-1 gap-4 border rounded-lg p-4 bg-white text-center">
      <SelectedFaculty @select-faculty="faculty"></SelectedFaculty>
      <SelectedForm @select-form="form"></SelectedForm>
      <SelectedCourse @select-course="course"></SelectedCourse>
      <SelectedGroup></SelectedGroup>
      <AppButton @click="$emit('select-schedule')"> Добавить </AppButton>
    </div>
  </div>
</template>

<script setup>
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import AppButton from "../UI/AppButton.vue";
import SelectedFaculty from "./SelectedFaculty.vue";
import SelectedForm from "./SelectedForm.vue";
import SelectedCourse from "./SelectedCourse.vue";
import SelectedGroup from "./SelectedGroup.vue";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useGroupOnCourse } from "@/stores/getGroupCourses";


const getForm = useFormFaculty()
const getCorse = useCoursesFaculty()
const getGroup = useGroupOnCourse()
const nowFaculty = ref()


const formFacultyStore = useCoursesFaculty();
const formGroupStore = useGroupOnCourse()
const { nowForm } = storeToRefs(formFacultyStore);
const { nowCourse } = storeToRefs(formGroupStore)


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
</script>
