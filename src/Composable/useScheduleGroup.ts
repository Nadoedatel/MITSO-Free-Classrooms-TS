import { useScheduleGroup } from "@/stores/getScheduleGroup";
import type { Faculty } from "@/types/faculty";
import type { Lesson } from "@/types/lesson";
import useGroups from "./useGroupCourse";
import useCourses from "./useCoursesFaculty";
import useFacultyForms from "./useFormFaculty";
import { computed } from "vue";

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
      // 1. Загрузка цепочки зависимых данных
      await fetchFacultyForms(faculty);
      await fetchCourses(faculty);
      await fetchGroups(faculty);

      // 2. Проверка обязательных параметров
      if (!currentForm.value?.name || !currentCourse.value?.name || !scheduleStore.nowGroup?.name) {
        throw new Error("Не удалось установить все необходимые параметры");
      }

      // 3. Формирование запроса
      const params = new URLSearchParams({
        faculty: faculty.name,
        form: currentForm.value.name,
        course: currentCourse.value.name,
        group: scheduleStore.nowGroup.name
      });

      const response = await fetch(`/api/schedule/group-schedules?${params}`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();

      // 4. Обработка данных
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