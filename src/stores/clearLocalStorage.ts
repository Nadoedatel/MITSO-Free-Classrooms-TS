import { defineStore } from "pinia";

export const useClearLocalStorage = defineStore("clearLocalStorage", () => {
    const clearAll = () => {
        localStorage.clear();
        
    };
    
    return {
        clearAll
    }
});