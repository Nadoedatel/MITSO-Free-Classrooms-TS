import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useFormFaculty } from "@/stores/getFormFaculty";
import type { Course } from "@/types/course";
import { computed } from "vue";
import type { Faculty } from "@/types/faculty";
import useFacultyForms from "./useFacultyForm";

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

      const params = new URLSearchParams({
        faculty: faculty.name,
        form: coursesStore.nowForm?.name || ''
      });

      const response = await fetch(`/api/schedule/courses?${params}`);
      const data: Course[] = await response.json();
      
      coursesStore.setCourses(data);
      return data;
    } catch (error) {
      console.error("Course fetch error:", error);
      throw error;
    }
  };

  return {
    fetchCourses,
    courses: computed(() => coursesStore.arrCourses),
    currentForm: computed(() => coursesStore.nowForm)
  };
}