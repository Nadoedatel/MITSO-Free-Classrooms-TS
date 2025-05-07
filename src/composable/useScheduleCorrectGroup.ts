import { useScheduleCorrectStore } from "@/stores/getScheduleCorrectGroup";
import type { AllLesson } from "@/types/allLesson";
import type { Faculty } from "@/types/faculty";
import type { Lesson } from "@/types/lesson";
import { computed } from "vue";

export default function useScheduleCorrect() {
  const store = useScheduleCorrectStore();

  const processScheduleData = (data: Record<string, Record<string, Lesson[]>>): AllLesson => {
    const newSchedule: Lesson[] = [];

    Object.values(data).forEach((week) => {
      Object.entries(week).forEach(([_, dayLessons]) => {
        dayLessons.forEach((lesson) => {
          if (lesson.subject?.trim()) {
            newSchedule.push(lesson);
          }
        });
      });
    });

    return newSchedule;
  };

  const fetchSchedule = async (faculty: Faculty, fullSchedule = false): Promise<void> => {
    try {
      if (!faculty.name || !store.correctForm?.name || 
          !store.correctCourse?.name || !store.correctGroup?.name) {
        console.log(faculty.name, store.correctForm?.name, store.correctCourse?.name, store.correctGroup?.name);
        throw new Error("Не все параметры установлены");
      }

      const params = new URLSearchParams({
        faculty: faculty.name,
        form: store.correctForm.name,
        course: store.correctCourse.name,
        group: store.correctGroup.name
      });

      const response = await fetch(`/api/schedule/group-schedules?${params}`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();

      if (fullSchedule) {
        const processed = processScheduleData(data);
        store.setScheduleData(processed);
      }

    } catch (error) {
      console.error("Schedule fetch error:", error);
      throw error;
    }
  };

  return {
    fetchSchedule,
    setForm: store.setForm,
    setFaculty: store.setFaculty,
    setCourse: store.setCourse,
    setGroup: store.setGroup,
    schedule: computed(() => store.allInfoSchedule),
    currentFaculty: computed(() => store.correctFaculty),
    currentForm: computed(() => store.correctForm),
    currentCourse: computed(() => store.correctCourse),
    currentGroup: computed(() => store.correctGroup)
  };
}