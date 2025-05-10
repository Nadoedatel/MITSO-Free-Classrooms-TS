import type { Faculty } from "@/types/faculty";
import type { Group } from "@/types/group";
import useFacultyForms from "./useFormFaculty";
import { useGroupStore } from "@/stores/getGroupCourses";
import useCourses from "./useCoursesFaculty";
import { computed } from "vue";
import { fetchGroupAPI } from "@/constants/API";

export default function useGroups() {
  const groupsStore = useGroupStore();
  const { fetchCourses, currentForm, courses } = useCourses();
  const { fetchFacultyForms, forms } = useFacultyForms();

  const fetchGroups = async (faculty: Faculty) => {
    try {
      if (!forms.value) {
        await fetchFacultyForms(faculty);
      }

      if (!courses.value) {
        await fetchCourses(faculty);
      }

      if (courses.value.length > 0 && !groupsStore.nowCourse) {
        groupsStore.setCurrentCourse(courses.value[0]);
      }

      if (!currentForm.value?.name || !groupsStore.nowCourse?.name) {
        console.log(
          `Загрузка групп для формы "${currentForm.value?.name}" и курса "${groupsStore.nowCourse?.name}, Факультет: ${faculty.name}"`
        );
        throw new Error("Требуемые данные не загружены");
      }

      // console.log(
      //   `Загрузка групп для формы "${currentForm.value?.name}" и курса "${groupsStore.nowCourse?.name}, Факультет: ${faculty.name}"`
      // );

      const data: Group[] = await fetchGroupAPI(faculty.name)
      
      groupsStore.setGroups(data);
      
      return data;
    } catch (error) {
      console.error("Groups fetch error:", error);
      throw error;
    }
  };

  return {
    fetchGroups,
    groups: computed(() => groupsStore.arrGroup),
    currentCourse: computed(() => groupsStore.nowCourse),
    setCurrentCourse: groupsStore.setCurrentCourse
  };
}