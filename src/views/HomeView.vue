<script setup>
import { ref, onMounted } from 'vue';
import { useFormFaculty } from "@/stores/getFormFaculty";
import { useCoursesFaculty } from "@/stores/getCoursesFaculty";
import { useGroupOnCourse } from "@/stores/getGroupCourses";
import { useScheduleGroup } from "@/stores/getScheduleGroup";
import { useCheckBusyAuditorium } from "@/stores/checkBusyAuditorium";
import { useAuditorium } from "@/stores/objectAuditorium";

const auditoriumStore = useAuditorium();
const checkBusyAuditorium = useCheckBusyAuditorium();
const getScheduleGroup = useScheduleGroup();
const getGroupCourses = useGroupOnCourse();
const getCourseFaculty = useCoursesFaculty();
const getFormsStuding = useFormFaculty();

const isLoading = ref(false);
const error = ref(null);

const loadData = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    await checkBusyAuditorium.loadAllData();
    await checkBusyAuditorium.loadAllSchedules();
    await checkBusyAuditorium.initFullSchedule('auditoriumsInNewCorpus');
  } catch (err) {
    error.value = err.message;
    console.error('Ошибка загрузки данных:', err);
  } finally {
    isLoading.value = false;
  }
};

const loadAuditoriums = async (corpusType) => {
  try {
    isLoading.value = true;
    await checkBusyAuditorium.initFullSchedule(corpusType);
  } catch (err) {
    error.value = `Ошибка загрузки аудиторий: ${err.message}`;
  } finally {
    isLoading.value = false;
  }
};


</script>

<template>
  <div class="space-y-6">
    <!-- Состояние загрузки и ошибки -->
    <div v-if="isLoading" class="p-4 bg-blue-50 text-blue-600 rounded-lg">
      Загрузка данных...
    </div>
    <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg">
      {{ error }}
    </div>

    <!-- Панель управления -->
    <div class="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg">
      <button
        v-for="(action, index) in [
          { label: 'Формы обучения', method: getFormsStuding.getFormOnFaculty },
          { label: 'Курсы', method: getCourseFaculty.getCourseFaculty },
          { label: 'Группы', method: getGroupCourses.getGroupOnCourse },
          { label: 'Расписание группы', method: getScheduleGroup.getScheduleGroup },
          { label: 'Инициализация аудиторий', method: loadData  }
        ]"
        :key="index"
        @click="action.method"
        class="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-amber-400 transition-colors"
        :disabled="isLoading"
      >
        {{ action.label }}
      </button>
    </div>

    <!-- Выбор корпуса -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
      <div 
        v-for="building in [
          { type: 'auditoriumsInNewCorpus', label: 'Новый корпус' },
          { type: 'auditoriumsInOldCorpus', label: 'Старый корпус' },
          { type: 'auditoriumsInDormitory', label: 'Общага' }
        ]"
        :key="building.type"
        class="border rounded-lg p-4 bg-white text-center"
      >
        <h3 class="font-medium mb-2">{{ building.label }}</h3>
        <button
          @click="loadAuditoriums(building.type)"
          class="px-4 py-2 bg-amber-100 hover:bg-amber-400 rounded-md transition-colors"
          :disabled="isLoading"
        >
          Получить аудитории
        </button>
      </div>
    </div>

    <!-- Список аудиторий -->
    <div v-if="Object.keys(auditoriumStore.fullSchedule).length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
      <div 
        v-for="(schedule, auditorium) in auditoriumStore.fullSchedule"
        :key="auditorium"
        class="border rounded-lg p-6 bg-white shadow-sm"
      >
        <h3 class="text-xl font-bold mb-4">Аудитория {{ auditorium }}</h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
          <div
            v-for="(lesson, time) in schedule"
            :key="time"
            class="border rounded p-3 transition-all hover:shadow-md"
            :class="{
              'bg-red-200 border-red-200': lesson,
              'bg-gray-50 border-gray-200': !lesson
            }"
          >
            <div class="text-sm font-medium text-gray-500 mb-1">{{ time }}</div>
            <template v-if="lesson">
              <div class="font-medium text-gray-800">{{ lesson.group }}</div>
              <div v-if="lesson.subject" class="text-sm text-gray-600 mt-1">
                {{ lesson.subject }}
              </div>
            </template>
            <div v-else class="text-gray-400 italic text-sm">Свободно</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="p-6 text-center text-gray-500">
      Нет данных об аудиториях. Загрузите данные для одного из корпусов.
    </div>
  </div>
</template>