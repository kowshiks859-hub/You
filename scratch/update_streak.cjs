const fs = require('fs');

let app = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Replace the streak break check
app = app.replace(
  /\/\/ Check streak\n  useEffect\(\(\) => \{\n    const todayRec = dailyData\[todayStr\];\n    if \(!todayRec \|\| todayRec\.hasAwardedStreak\) return;\n\n    \/\/ Check if yesterday existed\. If not, streak is broken, UNLESS it's day 1\n    const yesterday = new Date\(\);\n    yesterday\.setDate\(yesterday\.getDate\(\) - 1\);\n    const yesterdayStr = yesterday\.toISOString\(\)\.split\('T'\)\[0\];\n\n    const yesterdayRec = dailyData\[yesterdayStr\];\n    if \(!yesterdayRec && user\.currentStreak > 0 && Object\.keys\(dailyData\)\.length > 1\) \{\n       \/\/ Streak broken\n       setUser\(prev => \(\{ \.\.\.prev, currentStreak: 0, todayXp: 0 \}\)\);\n    \}\n  \/\/ eslint-disable-next-line react-hooks\/exhaustive-deps\n  \}, \[todayStr\]\);/,
  `// Check streak
  useEffect(() => {
    const todayRec = dailyData[todayStr];
    if (!todayRec) return;

    // Check if yesterday was successful. If not, streak is broken.
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const yesterdayRec = dailyData[yesterdayStr];
    const isFirstDay = Object.keys(dailyData).length <= 1;
    
    // If yesterday didn't exist or wasn't completed, and we aren't on the very first day, break streak
    if (!isFirstDay && user.currentStreak > 0 && (!yesterdayRec || !yesterdayRec.hasAwardedStreak)) {
       setUser(prev => ({ ...prev, currentStreak: 0, todayXp: 0 }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayStr]);`
);

// Replace the automatic streak award condition
app = app.replace(
  /\/\/ Automatically check if day requirements are met for streak\n  useEffect\(\(\) => \{\n    const todayRec = dailyData\[todayStr\];\n    if \(!todayRec\) return;\n    if \(todayRec\.hasAwardedStreak\) return;\n\n    const nutritionMet = todayNutrition\.protein >= nutritionGoal\.protein;\n    const highTasks = tasks\.filter\(t => t\.priority === 'high'\);\n    const allHighCompleted = highTasks\.length > 0 && highTasks\.every\(t => t\.completed\);\n\n    if \(nutritionMet \|\| allHighCompleted\) \{/,
  `// Automatically check if day requirements are met for streak
  useEffect(() => {
    const todayRec = dailyData[todayStr];
    if (!todayRec) return;
    if (todayRec.hasAwardedStreak) return;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const requiredTasks = Math.ceil(totalTasks * 0.6);
    
    const hasEnoughTasks = totalTasks > 0 && completedTasks >= requiredTasks;

    if (hasEnoughTasks) {`
);

fs.writeFileSync('src/context/AppContext.tsx', app);
