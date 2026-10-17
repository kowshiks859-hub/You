const fs = require('fs');
const path = 'src/context/AppContext.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update todayNutrition to only sum consumed
content = content.replace(
  /const todayNutrition = useMemo\(\(\) => \{[\s\S]*?\}, \[loggedFoods\]\);/,
  `const todayNutrition = useMemo(() => {
    return loggedFoods
      .filter(item => item.consumed)
      .reduce(
        (acc, item) => ({
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fat: acc.fat + item.fat,
          fiber: acc.fiber + item.fiber
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
      );
  }, [loggedFoods]);`
);

// Update addXp
content = content.replace(
  /const addXp = \(amount: number, reason: string\) => \{[\s\S]*?  \};/m,
  `const addXp = (amount: number, reason: string) => {
    setUser(prev => {
      let currentLifetimeXp = prev.xp + amount;
      let currentTodayXp = prev.todayXp + amount;
      
      // Calculate level based strictly on lifetime XP threshold of 800
      let currentLevel = Math.floor(currentLifetimeXp / 800) + 1;
      let xpRequired = 800;
      let didLevelUp = currentLevel > prev.level;
      let newBadge: Badge | undefined;

      if (didLevelUp) {
        soundFx.playLevelUp();
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e52521', '#facc15', '#1d4ed8', '#15803d', '#ffffff']
        });

        const badgeCandidate = ALL_AVAILABLE_BADGES.find(b => !prev.unlockedBadges.some(ub => ub.id === b.id));
        if (badgeCandidate) {
          newBadge = { ...badgeCandidate, unlockedAt: new Date().toISOString().split('T')[0] };
        }

        setLevelUpInfo({
          newLevel: currentLevel,
          oldLevel: prev.level,
          unlockedBadge: newBadge
        });
      }

      setNotifications(prevNotes => [
        {
          id: \`note-\${Date.now()}\`,
          title: \`+\${amount} XP Earned! ⚡\`,
          message: reason,
          type: 'reward',
          time: 'Just now',
          read: false
        },
        ...prevNotes
      ]);

      return {
        ...prev,
        xp: currentLifetimeXp,
        todayXp: currentTodayXp,
        level: currentLevel,
        xpToNextLevel: xpRequired,
        unlockedBadges: newBadge ? [...prev.unlockedBadges, newBadge] : prev.unlockedBadges
      };
    });
  };`
);

// Update toggleTask to check hasAwardedXp
content = content.replace(
  /const toggleTask = \(id: string\) => \{[\s\S]*?  \};/m,
  `const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          let nextAwarded = t.hasAwardedXp;
          if (nextCompleted) {
            soundFx.playPunch();
            if (!t.hasAwardedXp) {
              addXp(t.xpReward, \`Completed mission: \${t.title}\`);
              nextAwarded = true;
            }
          } else {
            soundFx.playClick();
          }
          return {
            ...t,
            completed: nextCompleted,
            hasAwardedXp: nextAwarded,
            completedAt: nextCompleted ? new Date().toISOString() : undefined
          };
        }
        return t;
      })
    );
  };`
);

// Replace completeTodayAction with nextDayAction
content = content.replace(
  /\/\/ Complete today action[\s\S]*?\/\/ Notifications actions/,
  `// Next Day Action
  const nextDayAction = () => {
    soundFx.playLevelUp();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#e52521', '#facc15', '#1d4ed8', '#15803d']
    });

    const todayDate = new Date().toISOString().split('T')[0];

    // Determine streak (did they complete nutrition + all high priority?)
    // For simplicity of streak rule: at least nutrition and 1 high priority task
    const nutritionMet = todayNutrition.protein >= nutritionGoal.protein;
    const highTasks = tasks.filter(t => t.priority === 'high');
    const allHighCompleted = highTasks.length > 0 && highTasks.every(t => t.completed);
    
    let newStreak = user.currentStreak;
    if (nutritionMet || allHighCompleted) {
       newStreak += 1;
    } else {
       newStreak = 0;
    }

    let claim30 = user.milestone30Claimed;
    if (newStreak >= 30 && !claim30) {
       addXp(100, "30-Day Streak Bonus! 🔥");
       claim30 = true;
    }

    // Save Nutrition History
    setNutritionHistory(prev => {
      return [
        {
          date: todayDate,
          dayLabel: \`Day \${user.currentDayNumber}\`,
          dayNumber: user.currentDayNumber,
          calories: todayNutrition.calories,
          protein: todayNutrition.protein,
          carbs: todayNutrition.carbs,
          fat: todayNutrition.fat,
          fiber: todayNutrition.fiber,
          waterMl,
          creatineGrams,
        },
        ...prev
      ];
    });

    // Reset daily tasks, preserve default tasks
    setTasks(prev => {
      const resetTasks = prev.map(t => {
        if (t.isDefaultTask) {
           return { ...t, completed: false, hasAwardedXp: false };
        }
        return { ...t, completed: false, hasAwardedXp: false };
      });
      return resetTasks;
    });

    // Reset food log
    setLoggedFoods(prev => prev.map(f => ({...f, consumed: false})));
    setWaterMl(0);

    // Update User Profile
    setUser(prev => ({
      ...prev,
      todayXp: 0,
      currentDayNumber: prev.currentDayNumber + 1,
      currentStreak: newStreak,
      bestStreak: Math.max(prev.bestStreak, newStreak),
      milestone30Claimed: claim30
    }));
  };

  // Nutrition Auto-completion effect
  useEffect(() => {
    const nutritionTask = tasks.find(t => t.isDefaultTask && t.title === 'Complete Nutrition Tracking');
    if (nutritionTask) {
       const isMet = todayNutrition.protein >= nutritionGoal.protein;
       if (isMet && !nutritionTask.completed) {
          toggleTask(nutritionTask.id);
       } else if (!isMet && nutritionTask.completed) {
          // Uncheck without removing XP if it was already awarded, or maybe we don't worry about XP removal
          // just uncheck it visually.
          setTasks(prev => prev.map(t => t.id === nutritionTask.id ? { ...t, completed: false } : t));
       }
    }
  }, [todayNutrition.protein, nutritionGoal.protein]);

  // Notifications actions`
);

// Remove unused english / planner functions
content = content.replace(/\/\/ English session save[\s\S]*?\/\/ Next Day Action/, '// Next Day Action');

// Ensure export values match
content = content.replace(/englishSessions,[\s\S]*?weeklyGoals,/, 'weeklyGoals,');
content = content.replace(/toggleWeeklyGoal,[\s\S]*?autoGenerateNextWeekPlan,/, '');
content = content.replace(/consistencyHistory,[\s\S]*?completeTodayAction,/, 'nextDayAction,');
content = content.replace(/saveEnglishSession,/, '');

fs.writeFileSync(path, content, 'utf8');
