const fs = require('fs');
const path = 'src/context/AppContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const rewriteEnd = `
  // Import / Export
  const exportAppData = () => {
    const data = {
      auth,
      user,
      tasks,
      nutritionGoal,
      loggedFoods,
      waterMl,
      creatineGrams,
      nutritionHistory,
      reminderSettings,
      mealReminders,
      notifications,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importAppData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.user) setUser(data.user);
      if (data.tasks) setTasks(data.tasks);
      if (data.nutritionGoal) setNutritionGoal(data.nutritionGoal);
      if (data.loggedFoods) setLoggedFoods(data.loggedFoods);
      if (data.waterMl !== undefined) setWaterMl(data.waterMl);
      if (data.creatineGrams !== undefined) setCreatineGrams(data.creatineGrams);
      if (data.nutritionHistory) setNutritionHistory(data.nutritionHistory);
      if (data.reminderSettings) setReminderSettings(data.reminderSettings);
      if (data.mealReminders) setMealReminders(data.mealReminders);
      if (data.notifications) setNotifications(data.notifications);

      soundFx.playLevelUp();
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    soundFx.playClick();
    setUser(DEFAULT_USER_PROFILE);
    setTasks(DEFAULT_TASKS);
    setNutritionGoal(DEFAULT_NUTRITION_GOAL);
    setLoggedFoods(DEFAULT_FOOD_LOGS);
    setWaterMl(2250);
    setCreatineGrams(5);
    setNutritionHistory(DEFAULT_NUTRITION_HISTORY);
    setReminderSettings(DEFAULT_REMINDER_SETTINGS);
    setMealReminders(DEFAULT_MEAL_REMINDERS);
    setNotifications(DEFAULT_NOTIFICATIONS);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated: auth.isAuthenticated,
        currentUser: auth.user,
        loginUser,
        logoutUser,
        activeTab,
        setActiveTab,
        user,
        setUser,
        addXp,
        levelUpInfo,
        dismissLevelUp,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        toggleStarTask,
        nutritionGoal,
        setNutritionGoal,
        loggedFoods,
        addFoodLog,
        deleteFoodLog,
        updateFoodLog,
        todayNutrition,
        waterMl,
        addWater,
        creatineGrams,
        addCreatine,
        nutritionHistory,
        setNutritionHistory,
        logBodyWeight,
        reminderSettings,
        updateReminderSetting,
        mealReminders,
        updateMealReminder,
        nextDayAction,
        notifications,
        markNotificationRead,
        clearNotifications,
        isSettingsOpen,
        setIsSettingsOpen,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        exportAppData,
        importAppData,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
`;

content = content.replace(/\/\/ Import \/ Export[\s\S]*/, rewriteEnd.trim());

fs.writeFileSync(path, content, 'utf8');
