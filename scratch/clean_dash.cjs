const fs = require('fs');

let dash = fs.readFileSync('src/pages/DashboardPage.tsx', 'utf8');
dash = dash.replace(/import \{ CompleteTodaySection \} from '..\/components\/dashboard\/CompleteTodayModal';\n?/g, '');
dash = dash.replace(/<CompleteTodaySection \/>\n?/g, '');
fs.writeFileSync('src/pages/DashboardPage.tsx', dash);
