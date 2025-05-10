import useCourses from "@/composable/useCoursesFaculty";
import useGroups from "@/composable/useGroupCourse";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useGroupStore } from "@/stores/getGroupCourses";
import { useScheduleGroup } from "@/stores/getScheduleGroup";
import type { Course } from "@/types/course";
import type { Form } from "@/types/form";
import type { Group } from "@/types/group";

export const fetchFacultyAPI = async (faculty: string): Promise<Form[]> => {
  try {
    const response = await fetch(`/api/schedule/forms?faculty=${faculty}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка загрузки форм обучения:", error);
    throw error;
  }
};

export const fetchCourseAPI = async (faculty: string): Promise<Course[]> => {
  try {
    const coursesStore = useCoursesFaculty();
    const response = await fetch(
      `/api/schedule/courses?faculty=${faculty}&form=${coursesStore.nowForm?.name}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка загрузки форм обучения:", error);
    throw error;
  }
};

export const fetchGroupAPI = async (faculty: string): Promise<Group[]> => {
  try {
    const groupsStore = useGroupStore();
    const { currentForm } = useCourses();

    const response = await fetch(
      `/api/schedule/groups?faculty=${faculty}&form=${currentForm.value?.name}&course=${groupsStore.nowCourse?.name}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка загрузки форм обучения:", error);
    throw error;
  }
};

export const fetchScheduleAPI = async (faculty: string, form: string, course: string, group: string) => {
  try {
    if (
      !form ||
      !course ||
      !group
    ) {
        console.log(form , course, group, faculty);
        
      throw new Error("Не удалось установить все необходимые параметры");
    }

    const response = await fetch(
      `/api/schedule/group-schedules?faculty=${faculty}&form=${form}&course=${course}&group=${group}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка загрузки форм обучения:", error);
    throw error;
  }
};
