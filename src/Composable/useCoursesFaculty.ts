async function getCourseFaculty(faculty: Faculty): Promise<void> {
    try {
      if (arrForm.value.length === 0) {
        await formFacultyStore.getFormFaculty(faculty);
      }
      
      if (!nowForm.value) {
        setCurrentForm();
      }

      if (!nowForm.value) {
        throw new Error("Не удалось установить форму обучения");
      }

      console.log(`Текущая форма обучения: ${nowForm.value.name}, Факультет ${faculty.name}`);

      const response = await fetch(
        `/api/schedule/courses?faculty=${faculty.name}&form=${nowForm.value.name}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Course[] = await response.json();  

      arrCourses.value = data;
      console.log("%c Курсы успешно загруженые:", 'background: red', arrCourses.value);
    } catch (error) {
      console.error("Ошибка в getCourseFaculty:", error);
    }
  }