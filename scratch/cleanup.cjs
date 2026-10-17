const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/import \{ FloatingAssistant \} from '.\/components\/common\/FloatingAssistant';\n?/g, '');
app = app.replace(/<FloatingAssistant \/>\n?/g, '');
fs.writeFileSync('src/App.tsx', app);

let mf = fs.readFileSync('src/components/common/MobileFrame.tsx', 'utf8');
mf = mf.replace(/import \{ FloatingAssistant \} from '.\/FloatingAssistant';\n?/g, '');
mf = mf.replace(/<FloatingAssistant \/>\n?/g, '');
fs.writeFileSync('src/components/common/MobileFrame.tsx', mf);

let ft = fs.readFileSync('src/pages/FoodTrackerPage.tsx', 'utf8');
ft = ft.replace(/import \{ CameraFoodScanner \} from '..\/components\/food\/CameraFoodScanner';\n?/g, '');
ft = ft.replace(/import \{ MealReminderCard \} from '..\/components\/food\/MealReminderCard';\n?/g, '');
ft = ft.replace(/import \{ NutritionChatDrawer \} from '..\/components\/food\/NutritionChatDrawer';\n?/g, '');
ft = ft.replace(/\{\/\* 3\. AI Camera Food Scanner \(Coin Calibration \+ Ingredient Editor\) \*\/\}\s*<CameraFoodScanner \/>\n?/g, '');
ft = ft.replace(/\{\/\* 6\. Tactical Meal Reminders Schedule \*\/\}\s*<MealReminderCard \/>\n?/g, '');
ft = ft.replace(/\{\/\* 7\. AI Nutritionist Chat \*\/\}\s*<NutritionChatDrawer \/>\n?/g, '');
fs.writeFileSync('src/pages/FoodTrackerPage.tsx', ft);
