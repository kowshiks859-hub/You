const fs = require('fs');
const path = 'src/components/common/MobileFrame.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add import
content = content.replace(/import \{ Bell, Settings, Home, Utensils, Mic, Calendar \} from 'lucide-react';/, "import { Bell, Settings, Home, Utensils, Calendar, Wrench } from 'lucide-react';\nimport { AdminControlsModal } from './AdminControlsModal';");

// Add state
content = content.replace(/const unreadNotificationsCount/, 'const [isAdminControlsOpen, setIsAdminControlsOpen] = React.useState(false);\n  const unreadNotificationsCount');

// Add button next to settings
const settingsButtonRegex = /<button[\s\S]*?aria-label="Settings"[\s\S]*?<\/button>/;
const settingsButtonText = content.match(settingsButtonRegex)[0];

const newButtons = `${settingsButtonText}
            {/* Admin Controls Icon */}
            <button
              onClick={() => {
                soundFx.playClick();
                setIsAdminControlsOpen(true);
              }}
              className="p-2 bg-paper-light hover:bg-stone-100 border-2 border-comic-black rounded-xl transition-transform active:scale-90"
              aria-label="Tracker Controls"
            >
              <Wrench className="w-4 h-4 text-comic-blue stroke-[2.5]" />
            </button>`;

content = content.replace(settingsButtonRegex, newButtons);

// Render modal
content = content.replace(/<\/div>\s*<\/div>\s*\);\s*};\s*$/, "      {isAdminControlsOpen && <AdminControlsModal onClose={() => setIsAdminControlsOpen(false)} />}\n      </div>\n    </div>\n  );\n};\n");

fs.writeFileSync(path, content, 'utf8');
