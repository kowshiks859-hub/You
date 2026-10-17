const fs = require('fs');
const path = 'src/pages/WeeklyPlannerPage.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync(path, content, 'utf8');
