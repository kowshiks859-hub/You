
const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/MissionList.tsx', 'utf8');

const replacement = \    const styles = {
      major: { border: 'border-purple-600', bg: 'bg-purple-50', badge: 'purple', label: 'MAJOR' },
      hot: { border: 'border-comic-red', bg: 'bg-red-50', badge: 'red', label: 'HOT' },
      high: { border: 'border-comic-red', bg: 'bg-red-50', badge: 'red', label: 'HIGH' },
      medium: { border: 'border-amber-500', bg: 'bg-amber-50', badge: 'yellow', label: 'MEDIUM' },
      low: { border: 'border-comic-blue', bg: 'bg-blue-50', badge: 'blue', label: 'LOW' }
    };\;

content = content.replace(/const styles = \{[\s\S]*?low:.*?\}[\s\S]*?\};/, replacement);

fs.writeFileSync('src/components/dashboard/MissionList.tsx', content);

