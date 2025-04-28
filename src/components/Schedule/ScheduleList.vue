<template>
  <div class="space-y-6 p-4">
    <!-- Панель управления неделями -->
    <div
      class="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow"
    >
      <button
        @click="prevWeek"
        class="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        <ArrowLeftIcon class="w-5 h-5 mr-2" />
        Предыдущая
      </button>

      <h2 class="text-xl font-bold text-gray-800">
        {{ weekRange }}
      </h2>

      <button
        @click="nextWeek"
        class="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
      >
        Следующая
        <ArrowRightIcon class="w-5 h-5 ml-2" />
      </button>
    </div>

    <!-- Расписание по дням -->
    <div
      v-if="hasData"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"
    >
      <div
        v-for="(dayLessons, date) in groupedSchedule"
        :key="date"
        class="bg-white p-4 rounded-lg shadow-sm"
      >
        <h3
          class="text-lg font-semibold mb-4 text-gray-800 sticky top-0 bg-white py-2"
        >
          {{ formatDate(date) }}
        </h3>

        <div class="space-y-3">
          <div
            v-for="(timeSlot, timeKey) in dayLessons"
            :key="timeKey"
            class="border rounded-lg bg-fuchsia-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            <div class="p-4">
              <!-- Общая информация о паре -->
              <p class="font-medium text-gray-700">{{ timeSlot.subject }}</p>
              <p class="text-sm text-gray-600 mb-3">{{ timeSlot.time }}</p>

              <!-- Список подгрупп -->
              <div class="space-y-2 border-t pt-3 text-sm">
                <div v-for="lesson in timeSlot.lessons" :key="lesson.id">
                  <p
                    v-if="lesson.teacher"
                    class="flex items-center text-gray-700"
                  >
                    <span class="mr-2">👤</span>
                    {{ lesson.teacher }}
                  </p>
                  <p
                    v-if="lesson.auditorium?.trim()"
                    class="flex items-center text-gray-700"
                  >
                    <span class="mr-2">🏢</span>
                    Ауд. {{ lesson.auditorium }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="p-8 text-center text-gray-500 bg-white rounded-lg shadow"
    >
      <CalendarIcon class="w-12 h-12 mx-auto text-gray-300" />
      <p class="mt-4 text-lg">На этой неделе занятий нет</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  allInfoSchedule: Array,
  hasData: {
    type: Boolean,
    default: false,
  },
});

// Управление неделями
const currentWeekOffset = ref(0);

// Фильтрация занятий по неделе
const filteredLessons = computed(() => {
  if (!props.allInfoSchedule?.length) return [];

  const { startOfWeek, endOfWeek } = getWeekBounds();
  return props.allInfoSchedule.filter((lesson) => {
    const lessonDate = new Date(lesson.date);
    return lessonDate >= startOfWeek && lessonDate <= endOfWeek;
  });
});

// Группировка по дням
const groupedSchedule = computed(() => {
  const grouped = {};

  filteredLessons.value.forEach((lesson) => {
    // Проверяем только название предмета (пустое или "-")
    if (
      !lesson.subject?.trim() ||
      lesson.subject.trim() === "-" ||
      lesson.subject.trim() === "2. -" ||
      lesson.subject.trim() === "1. -"
    )
      return;

    const dateKey = lesson.date;
    const cleanSubject = lesson.subject.replace(/^[12]\.\s*/, "").trim();
    if (!cleanSubject) return;

    const timeKey = `${cleanSubject}|${lesson.time}`;

    if (!grouped[dateKey]) grouped[dateKey] = {};
    if (!grouped[dateKey][timeKey]) {
      grouped[dateKey][timeKey] = {
        subject: cleanSubject,
        time: lesson.time,
        lessons: [],
      };
    }

    // Добавляем урок, даже если аудитория или преподаватель пустые
    grouped[dateKey][timeKey].lessons.push(lesson);
  });

  return grouped;
});

// Границы недели
const getWeekBounds = () => {
  const now = new Date();
  const mondayOffset = now.getDay() === 0 ? -6 : 1 - now.getDay();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(
    now.getDate() + mondayOffset + currentWeekOffset.value * 7
  );
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
};

// Форматирование даты
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
};

// Диапазон недели
const weekRange = computed(() => {
  const { startOfWeek, endOfWeek } = getWeekBounds();
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatRange(startOfWeek, endOfWeek);
});

// Навигация по неделям
const prevWeek = () => currentWeekOffset.value--;
const nextWeek = () => currentWeekOffset.value++;
</script>
