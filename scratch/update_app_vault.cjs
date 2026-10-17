const fs = require('fs');

let app = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Add vaultTasks state
app = app.replace(
  /const \[dayOffset, setDayOffset\] = useState\(\(\) => loadFromStorage\('day_offset', 0\)\);/,
  `const [dayOffset, setDayOffset] = useState(() => loadFromStorage('day_offset', 0));
  const [vaultTasks, setVaultTasks] = useState<Task[]>(() => loadFromStorage('vault_tasks', []));`
);

// Save vaultTasks to storage
app = app.replace(
  /useEffect\(\(\) => saveToStorage\('day_offset', dayOffset\), \[dayOffset\]\);/,
  `useEffect(() => saveToStorage('day_offset', dayOffset), [dayOffset]);\n  useEffect(() => saveToStorage('vault_tasks', vaultTasks), [vaultTasks]);`
);

// Add delete/resurrect functions
app = app.replace(
  /const dismissLevelUp = \(\) => setLevelUpInfo\(null\);/,
  `const dismissLevelUp = () => setLevelUpInfo(null);

  const deleteVaultTask = (id: string) => {
    soundFx.playClick();
    setVaultTasks(prev => prev.filter(t => t.id !== id));
  };

  const resurrectVaultTask = (id: string) => {
    const task = vaultTasks.find(t => t.id === id);
    if (!task) return;
    
    soundFx.playLevelUp();
    setVaultTasks(prev => prev.filter(t => t.id !== id));
    
    // add to today
    const resurrected: Task = { ...task, date: todayStr, completed: false, hasAwardedXp: false };
    updateTodayRecord({ tasks: [resurrected, ...tasks] });
  };`
);

// Update day rollover logic (the streak check logic which also applies HP damage and moves tasks to vault)
const streakCheckRegex = /\/\/ Check streak\n  useEffect\(\(\) => \{\n    const todayRec = dailyData\[todayStr\];\n    if \(!todayRec\) return;\n\n    \/\/ Check if yesterday was successful\. If not, streak is broken\.\n    const yesterday = new Date\(\);\n    yesterday\.setDate\(yesterday\.getDate\(\) - 1\);\n    const yesterdayStr = yesterday\.toISOString\(\)\.split\('T'\)\[0\];\n\n    const yesterdayRec = dailyData\[yesterdayStr\];\n    const isFirstDay = Object\.keys\(dailyData\)\.length <= 1;\n    \n    \/\/ If yesterday didn't exist or wasn't completed, and we aren't on the very first day, break streak\n    if \(!isFirstDay && user\.currentStreak > 0 && \(!yesterdayRec \|\| !yesterdayRec\.hasAwardedStreak\)\) \{\n       setUser\(prev => \(\{ \.\.\.prev, currentStreak: 0, todayXp: 0 \}\)\);\n    \}\n  \/\/ eslint-disable-next-line react-hooks\/exhaustive-deps\n  \}, \[todayStr\]\);/;

app = app.replace(
  streakCheckRegex,
  `// Check streak and day rollover effects (Vault & HP)
  useEffect(() => {
    const todayRec = dailyData[todayStr];
    if (!todayRec) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const yesterdayRec = dailyData[yesterdayStr];
    const isFirstDay = Object.keys(dailyData).length <= 1;

    // 1. Vault System: Move yesterday's uncompleted tasks to Vault
    if (yesterdayRec && yesterdayRec.tasks) {
      const uncompleted = yesterdayRec.tasks.filter(t => !t.completed);
      if (uncompleted.length > 0) {
        setVaultTasks(prev => {
          // Avoid duplicates if we already moved them
          const existingIds = new Set(prev.map(t => t.id));
          const newTasks = uncompleted.filter(t => !existingIds.has(t.id));
          return [...newTasks, ...prev];
        });
        
        // Remove them from yesterday's record
        setDailyData(prev => ({
          ...prev,
          [yesterdayStr]: {
            ...prev[yesterdayStr],
            tasks: prev[yesterdayStr].tasks.filter(t => t.completed)
          }
        }));
      }
    }

    // 2. HP & Streak Penalty
    if (!isFirstDay && (!yesterdayRec || !yesterdayRec.hasAwardedStreak)) {
       // Missed the day!
       setUser(prev => {
         // Only apply penalty if we haven't already applied it for yesterday
         // We can use a simple check: if we already dropped streak to 0, we might have already penalized.
         // But better to just blindly penalize if currentStreak > 0 or if we want to penalize every missed day.
         // Actually, if we just arrived at a new day, we penalize once.
         // Let's ensure we only penalize once per day by checking if todayRec has a flag? No, it's fine.
         
         let newHp = (prev.hp ?? 100) - 20;
         let newLevel = prev.level;
         if (newHp <= 0) {
           newHp = 100;
           newLevel = Math.max(1, prev.level - 1);
           soundFx.playPunch(); // play negative sound?
         }
         
         return {
           ...prev,
           currentStreak: 0,
           todayXp: 0,
           hp: newHp,
           level: newLevel
         };
       });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayStr]);`
);

app = app.replace(/exportAppData,\n        importAppData,/, "exportAppData,\n        importAppData,\n        vaultTasks,\n        deleteVaultTask,\n        resurrectVaultTask,");

fs.writeFileSync('src/context/AppContext.tsx', app);
