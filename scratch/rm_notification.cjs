const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/import \{ NotificationCenter \} from '.\/components\/common\/NotificationCenter';\n?/g, '');
app = app.replace(/<NotificationCenter \/>\n?/g, '');
fs.writeFileSync('src/App.tsx', app);
