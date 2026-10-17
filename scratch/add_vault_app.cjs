const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/import \{ MonthlyPlannerPage \} from '.\/pages\/MonthlyPlannerPage';\n/, "import { MonthlyPlannerPage } from './pages/MonthlyPlannerPage';\nimport { VaultPage } from './pages/VaultPage';\n");
app = app.replace(/\{activeTab === 'monthly_planner' && <MonthlyPlannerPage \/>\}\n/, "{activeTab === 'monthly_planner' && <MonthlyPlannerPage />}\n            {activeTab === 'vault' && <VaultPage />}\n");
fs.writeFileSync('src/App.tsx', app);
