import type { Faculty } from "@/types/faculty";
import type { Group } from "@/types/group";
import useFacultyForms from "./useFacultyForm";
import { useGroup } from "@/stores/getGroupCourses";
import useCourses from "./useCoursesFaculty";
import { computed } from "vue";

export default function useGroups() {
  const groupsStore = useGroup();
  const { fetchCourses, currentForm } = useCourses();
  const { fetchFacultyForms } = useFacultyForms();

  const fetchGroups = async (faculty: Faculty) => {
    try {
      // 1. Загрузка форм обучения при необходимости
      if (!currentForm.value) {
        await fetchFacultyForms(faculty);
      }

      // 2. Загрузка курсов при необходимости
      await fetchCourses(faculty);

      // 3. Проверка обязательных данных
      if (!currentForm.value?.name || !groupsStore.nowCourse?.name) {
        throw new Error("Требуемые данные не загружены");
      }

      // 4. Запрос групп
      const params = new URLSearchParams({
        faculty: faculty.name,
        form: currentForm.value.name,
        course: groupsStore.nowCourse.name
      });

      const response = await fetch(`/api/schedule/groups?${params}`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data: Group[] = await response.json();
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