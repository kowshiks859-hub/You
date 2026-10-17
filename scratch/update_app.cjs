const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/import \{ WeeklyPlannerPage \} from '.\/pages\/WeeklyPlannerPage';\n/, "import { WeeklyPlannerPage } from './pages/WeeklyPlannerPage';\nimport { MonthlyPlannerPage } from './pages/MonthlyPlannerPage';\n");
app = app.replace(/\{activeTab === 'planner' && <WeeklyPlannerPage \/>\}\n/, "{activeTab === 'planner' && <WeeklyPlannerPage />}\n            {activeTab === 'monthly_planner' && <MonthlyPlannerPage />}\n");
fs.writeFileSync('src/App.tsx', app);
