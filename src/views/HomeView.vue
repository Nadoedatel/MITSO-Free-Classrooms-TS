<script setup>
import { ref } from 'vue';
import { useCheckBusyAuditorium } from "@/stores/checkBusyAuditorium";
import { useAuditorium } from "@/stores/objectAuditorium";
import AuditoriumList from '@/components/Auditoriums/AuditoriumList.vue';
import PreLoader from '@/components/UI/PreLoader.vue';
import ControlPanel from '@/components/Auditoriums/ControlPanel.vue';
import BuildingSelector from '@/components/Auditoriums/BuildingSelector.vue';
import { useClearLocalStorage } from '@/stores/clearLocalStorage';

const clearLocalStorage = useClearLocalStorage()
const auditoriumStore = useAuditorium();
const checkBusyAuditorium = useCheckBusyAuditorium();

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

function handleAction(method) {
  if (method === 'init') {
    loadData();
  } else if (method === 'clear') {
    clearLocalStorage.clearAll();
    loadAuditoriums
  }
}

</script>

<template>
  <div class="space-y-6">
    <!-- <PreLoader :isLoading="isLoading" /> -->
    
    <ControlPanel 
      :isLoading="isLoading"
      @action="handleAction"
    />
    
    <BuildingSelector 
      :isLoading="isLoading"
      @select-building="loadAuditoriums"
    />
    
    <AuditoriumList 
      :fullSchedule="auditoriumStore.fullSchedule"
      :hasData="Object.keys(auditoriumStore.fullSchedule).length > 0"
    />
  </div>
</template>