// tests/stores/formFaculty.test.ts
import { useFormFaculty } from './getFormFaculty';
import { setActivePinia, createPinia } from 'pinia';
import { describe, expect, test, beforeEach } from 'vitest';
import { EducationForm, Faculty } from '../types/schedule';

describe('useFormFaculty', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('setCurrentFaculty устанавливает nowFaculty', () => {
    const store = useFormFaculty();
    const testFaculty: Faculty = { name: 'Юридический' };
  
    // 1. Проверяем установку с передачей факультета
    store.setCurrentFaculty(testFaculty);
    expect(store.nowFaculty).toEqual(testFaculty);
  
    // 2. Проверяем установку первого факультета, если ничего не передали
    store.setCurrentFaculty();
    expect(store.nowFaculty).toEqual(store.arrFaculty[0]);
  });
});