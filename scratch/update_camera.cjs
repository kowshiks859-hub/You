const fs = require('fs');
const path = 'src/components/food/CameraFoodScanner.tsx';
let content = fs.readFileSync(path, 'utf8');

// Change coin scale to a state for the selected coin
content = content.replace(/const \[useCoinScale, setUseCoinScale\] = useState\(true\);/, "const [coinScale, setCoinScale] = useState<string | null>('₹2');\n  const [aiContextInput, setAiContextInput] = useState('');");

// Replace the coin UI
const coinUiOld = /{useCoinScale && \([\s\S]*?<\/div>\s*\)}/;
const coinUiNew = `{coinScale && (
                    <div className="absolute -bottom-3 -right-3 px-1.5 py-0.5 bg-comic-yellow text-comic-black text-[8px] font-comic font-black rounded border border-comic-black">
                      🪙 \${coinScale} Coin Ref
                    </div>
                  )}`;
content = content.replace(coinUiOld, coinUiNew);

const coinScaleToggleOld = /<div className="flex items-center justify-between gap-2">[\s\S]*?<\/button>/;
const coinScaleToggleNew = `<div className="flex items-center justify-between gap-2">
                <div className="flex gap-1">
                   {['₹1', '₹2', '₹5'].map(coin => (
                     <button
                       key={coin}
                       onClick={() => setCoinScale(coinScale === coin ? null : coin)}
                       className={\`px-2 py-1 rounded-lg border-[1.5px] border-comic-black text-[10px] font-comic font-bold uppercase transition-all \${coinScale === coin ? 'bg-amber-200 text-stone-900 comic-shadow-sm' : 'bg-white text-stone-600'}\`}
                     >
                       🪙 {coin}
                     </button>
                   ))}
                </div>`;
content = content.replace(coinScaleToggleOld, coinScaleToggleNew);

// Add context input
const contextInputUi = `
              {/* Context Input */}
              <div className="p-2.5 bg-blue-50 border-[1.5px] border-comic-black rounded-xl">
                 <p className="text-[10px] font-bold text-stone-700 font-comic uppercase mb-1">
                   Help the AI (Optional)
                 </p>
                 <textarea 
                   className="w-full p-2 text-xs border border-comic-black rounded focus:outline-none focus:ring-1 focus:ring-comic-blue bg-white resize-none"
                   rows={2}
                   placeholder="What do you think the approximate quantity is? What ingredients were used?"
                   value={aiContextInput}
                   onChange={(e) => setAiContextInput(e.target.value)}
                 />
              </div>`;

// Insert after the scanner
content = content.replace(/\{\/\* Detected Results & Ingredient Editor \*\/\}/, contextInputUi + '\n\n              {/* Detected Results & Ingredient Editor */}');

// Update text to "Approximate Guidance"
content = content.replace(/\{scanResult\.confidence\}% AI MATCH/, '{scanResult.confidence}% APPROXIMATE GUIDANCE');

fs.writeFileSync(path, content, 'utf8');
