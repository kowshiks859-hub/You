const fs = require('fs');

let app = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

// Add nextDayAction to interface
app = app.replace(/export interface AppContextType \{/, "export interface AppContextType {\n  nextDayAction: () => void;");

// Remove global getTodayString
app = app.replace(/const getTodayString = \(\) => new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];\n/, "");

// Inject state and local getTodayString
app = app.replace(
  /const \[levelUpInfo, setLevelUpInfo\] = useState<LevelUpInfo \| null>\(null\);/,
  `const [levelUpInfo, setLevelUpInfo] = useState<LevelUpInfo | null>(null);
  const [dayOffset, setDayOffset] = useState(() => loadFromStorage('day_offset', 0));

  const getTodayString = () => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    return d.toISOString().split('T')[0];
  };`
);

// Save offset
app = app.replace(/useEffect\(\(\) => saveToStorage\('auth', auth\), \[auth\]\);/, `useEffect(() => saveToStorage('day_offset', dayOffset), [dayOffset]);\n  useEffect(() => saveToStorage('auth', auth), [auth]);`);

// Add nextDayAction function
app = app.replace(
  /const loginUser = \(data:/,
  `const nextDayAction = () => {
    setDayOffset(prev => prev + 1);
    setUser(prev => ({ ...prev, currentDayNumber: prev.currentDayNumber + 1 }));
    soundFx.playLevelUp();
  };

  const loginUser = (data:`
);

// Add to provider
app = app.replace(/resetToDefaults\n/, "resetToDefaults,\n        nextDayAction\n");

fs.writeFileSync('src/context/AppContext.tsx', app);
