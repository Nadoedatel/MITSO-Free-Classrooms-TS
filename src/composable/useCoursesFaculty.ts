import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import type { Course } from "@/types/course";
import { computed } from "vue";
import type { Faculty } from "@/types/faculty";
import useFacultyForms from "./useFormFaculty";
import { fetchCourseAPI } from "@/constants/API";

export default function useCourses() {
  const coursesStore = useCoursesFaculty();
  const formStore = useFormFaculty();
  const { fetchFacultyForms } = useFacultyForms();

  const fetchCourses = async (faculty: Faculty) => {
    try {
      if (formStore.arrForm.length === 0) {
        await fetchFacultyForms(faculty);
      }

      if (!coursesStore.nowForm) {
        coursesStore.setCurrentForm(formStore.arrForm[0]);
      }
      // console.log(`Текущая форма обучения: ${coursesStore.nowForm?.name}, Факультет ${faculty.name}`);
      const course: Course[] = await fetchCourseAPI(faculty.name)
      
      coursesStore.setCourses(course);
      return course;
    } catch (error) {
      console.error("Course fetch error:", error);
      throw error;
    }
  };

  return {
    fetchCourses,
    courses: computed(() => coursesStore.arrCourses),
    currentForm: computed(() => coursesStore.nowForm),
  };
}
