import type { Faculty } from "@/types/faculty";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useScheduleCorrectStore } from "@/stores/getScheduleCorrectGroup";
import type { Course } from "@/types/course";
import useGroups from "../useGroupCourse";
import { useGroupStore } from "@/stores/getGroupCourses";

export default function useLoadGroup() {
  const isLoading = ref(false);
  const getGroup = useGroups();
  const formScheduleStore = useScheduleCorrectStore();
  const { correctFaculty, correctCourse } = storeToRefs(formScheduleStore);
  const formGroupStore = useGroupStore();
  const { nowCourse } = storeToRefs(formGroupStore);
  const loadGroup = async (faculty: Faculty) => {
    try {
      isLoading.value = true;
  
      await getGroup.fetchGroups(faculty);
    } catch (err) {
      console.error("Ошибка загрузки форм:");
    } finally {
      isLoading.value = false;
    }
  };
  
  function handleCourseSelect(course: Course) {
    nowCourse.value = course
    correctCourse.value = course;
    console.log(course);
    if (!correctFaculty.value) {
        console.warn("Факультет не выбран");
        return;
      }
    loadGroup(correctFaculty.value);
  }
  return {
    handleCourseSelect,
    loadGroup,
    isLoading,
  };
}
