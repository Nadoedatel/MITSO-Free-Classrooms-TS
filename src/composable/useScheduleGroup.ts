import { useScheduleGroup } from "@/stores/getScheduleGroup";
import type { Faculty } from "@/types/faculty";
import type { Lesson } from "@/types/lesson";
import useGroups from "./useGroupCourse";
import useCourses from "./useCoursesFaculty";
import useFacultyForms from "./useFormFaculty";
import { computed } from "vue";
import { fetchScheduleAPI } from "@/constants/API";

export default function useSchedule() {
  const scheduleStore = useScheduleGroup();
  const { fetchGroups, currentCourse } = useGroups();
  const { fetchCourses, currentForm } = useCourses();
  const { fetchFacultyForms } = useFacultyForms();

  const processScheduleData = (data: Record<string, Record<string, Lesson[]>>): Lesson[] => {
    const newSchedule: Lesson[] = [];
  
    Object.values(data).forEach((week) => {
      Object.entries(week).forEach(([dateKey, dayLessons]) => {
        dayLessons.forEach((lesson) => {
          if (lesson.subject?.trim()) {
            newSchedule.push({
              id: lesson.id,
              date: dateKey,
              auditorium: lesson.auditorium,
              time: lesson.time,
              group_class: lesson.group_class,
              subject: lesson.subject.trim(),
            });
          }
        });
      });
    });
  
    return newSchedule;
  };

  const fetchSchedule = async (faculty: Faculty, fullSchedule = false): Promise<void> => {
    try {
      await fetchFacultyForms(faculty);
      await fetchCourses(faculty);
      await fetchGroups(faculty);

      if (!currentForm.value?.name || !currentCourse.value?.name || !scheduleStore.nowGroup?.name) {    
        // console.log(currentForm.value?.name, currentCourse.value?.name, scheduleStore.nowGroup?.name, "АЛЕ");   
        throw new Error("Не удалось установить все необходимые параметры");
      }
      
      const data = await fetchScheduleAPI(faculty.name, currentForm.value.name, currentCourse.value.name, scheduleStore.nowGroup.name);

      if (fullSchedule) {
        const fullData = processScheduleData(data);
        scheduleStore.setFullSchedule(fullData);
      }
      
      const processedData = processScheduleData(data);
      scheduleStore.setSchedule(processedData);

    } catch (error) {
      console.error("Schedule fetch error:", error);
      throw error;
    }
  };

  return {
    fetchSchedule,
    schedule: computed(() => scheduleStore.arrSchedule),
    fullSchedule: computed(() => scheduleStore.allInfoSchedule),
    currentGroup: computed(() => scheduleStore.nowGroup),
    setCurrentGroup: scheduleStore.setCurrentGroup
  };
}