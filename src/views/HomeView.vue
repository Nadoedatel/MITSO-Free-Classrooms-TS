<script setup lang="ts">
import { computed, ref } from 'vue';
import AuditoriumList from '@/components/Auditoriums/AuditoriumList.vue';
import PreLoader from '@/components/UI/PreLoader.vue';
import ControlPanel from '@/components/Auditoriums/ControlPanel.vue';
import BuildingSelector from '@/components/Auditoriums/BuildingSelector.vue';
import useAuditoriumBusyCheck from '@/Composable/useBusyAuditorium';
import { useAuditorium } from '@/stores/objectAuditorium';
import { useClearLocalStorage } from '@/stores/clearLocalStorage';

const {
  loadAllData,
  loadAllSchedules,
  initFullSchedule,
  isLoading: isCheckLoading
} = useAuditoriumBusyCheck();

const {
  fullSchedule
} = useAuditorium();

const { clearAll } = useClearLocalStorage();

// Состояние компонента
const error = ref<string | null>(null);
const isLoading = computed(() => isCheckLoading.value);

// Методы
const loadData = async (): Promise<void> => {
  try {
    error.value = null;
    await loadAllData();
    await loadAllSchedules();
    await initFullSchedule('auditoriumsInNewCorpus');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Неизвестная ошибка';
    console.error('Ошибка загрузки данных:', err);
  }
};

const loadAuditoriums = async (corpusType: string): Promise<void> => {
  try {
    error.value = null;
    await initFullSchedule(corpusType);
  } catch (err) {
    error.value = `Ошибка загрузки аудиторий: ${
      err instanceof Error ? err.message : 'Неизвестная ошибка'
    }`;
  }
};

const handleAction = (method: 'init' | 'clear'): void => {
  if (method === 'init') {
    loadData();
  } else if (method === 'clear') {
    clearAll();
    loadData(); 
  }
};
</script>

<template>
  <div class="space-y-6 dark:bg-[#2f2f2f] dark:text-white">
    <PreLoader 
      v-if="isLoading"
      class="dark:bg-[#242424] dark:text-white" 
      >
    </PreLoader>
    
    <ControlPanel 
      class="dark:bg-[#242424] dark:text-white"
      :isLoading="isLoading"
      @action="handleAction"
    />

    <BuildingSelector 
      class="dark:bg-[#242424] dark:text-white"
      :isLoading="isLoading"
      @select-building="loadAuditoriums"
    />
    
    <AuditoriumList 
      class="dark:bg-[#242424] dark:text-white"
      :fullSchedule="fullSchedule"
      :hasData="Object.keys(fullSchedule).length > 0"
    />

    <div 
      v-if="error"
      class="p-4 text-red-500 bg-red-50 dark:bg-red-900/20"
    >
      {{ error }}
    </div>
  </div>
</template>