<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import AuditoriumList from '@/components/Auditoriums/AuditoriumList.vue';
import PreLoader from '@/components/UI/PreLoader.vue';
import ControlPanel from '@/components/Auditoriums/ControlPanel.vue';
import BuildingSelector from '@/components/Auditoriums/BuildingSelector.vue';
import useAuditoriumBusyCheck from '@/Composable/useBusyAuditorium';
import { useAuditorium } from '@/stores/objectAuditorium';
import { useClearLocalStorage } from '@/stores/clearLocalStorage';
import { useUserDate } from '@/stores/getUserDate';

// Инициализация хранилищ
const userDateStore = useUserDate();
const auditoriumStore = useAuditorium();
const { clearAll } = useClearLocalStorage();

// Composables
const {
  loadAllData,
  loadAllSchedules,
  initFullSchedule,
  isLoading: isCheckLoading
} = useAuditoriumBusyCheck();

// Состояние компонента
const error = ref<string | null>(null);
const isLoading = computed(() => isCheckLoading.value);
const isInitialLoad = ref(true);

// Методы
const loadData = async (): Promise<void> => {
  try {
    error.value = null;
    await loadAllData();
    await refreshSchedule();
  } catch (err) {
    handleError(err, 'Ошибка загрузки данных');
  }
};

const refreshSchedule = async (): Promise<void> => {
  try {
    error.value = null;
    await loadAllSchedules();
    await initFullSchedule('auditoriumsInNewCorpus');
  } catch (err) {
    handleError(err, 'Ошибка обновления расписания');
  }
};

const loadAuditoriums = async (corpusType: string): Promise<void> => {
  try {
    error.value = null;
    await initFullSchedule(corpusType);
  } catch (err) {
    handleError(err, 'Ошибка загрузки аудиторий');
  }
};

const handleAction = async (method: 'init' | 'clear'): Promise<void> => {
  try {
    if (method === 'clear') {
      clearAll();
    }
    await loadData();
  } catch (err) {
    handleError(err, 'Ошибка выполнения действия');
  }
};

const handleError = (err: unknown, defaultMessage: string): void => {
  error.value = err instanceof Error ? err.message : defaultMessage;
  console.error(error.value, err);
};

// Инициализация и наблюдение за датой
onMounted(async () => {
  userDateStore.getUserCurrentDate();
  await loadData();
  isInitialLoad.value = false;
});

watch(
  () => userDateStore.currentDate,
  async (newDate) => {
    if (!isInitialLoad.value && newDate) {
      await refreshSchedule();
    }
  },
  { immediate: false }
);
</script>

<template>
  <div class="space-y-6 dark:bg-[#2f2f2f] dark:text-white">
    <div class="flex justify-between items-center dark:bg-[#242424] p-4 rounded">
      <input
        type="date"
        v-model="userDateStore.currentDate"
        class="dark:bg-[#2f2f2f] dark:text-white p-2 border rounded"
        :disabled="isLoading"
      >
      <ControlPanel 
        :isLoading="isLoading"
        @action="handleAction"
      />
    </div>

    <BuildingSelector 
      class="dark:bg-[#242424] dark:text-white"
      :isLoading="isLoading"
      @select-building="loadAuditoriums"
    />
    
    <PreLoader v-if="isLoading" />

    <AuditoriumList 
      class="dark:bg-[#242424] dark:text-white"
      :fullSchedule="auditoriumStore.fullSchedule"
      :hasData="Object.keys(auditoriumStore.fullSchedule).length > 0"
      :currentDate="userDateStore.currentDate"
    />

    <div 
      v-if="error"
      class="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded"
    >
      {{ error }}
    </div>
  </div>
</template>