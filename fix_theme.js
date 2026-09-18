
const fs = require("fs");
let content = fs.readFileSync("frontend/src/app/rbms/page.tsx", "utf8");

// 1. Global Backgrounds & Borders
content = content.replace(/bg-neutral-950/g, "bg-slate-50");
content = content.replace(/bg-neutral-900/g, "bg-white");
content = content.replace(/bg-neutral-800/g, "bg-slate-100");
content = content.replace(/border-neutral-800/g, "border-slate-200");
content = content.replace(/border-neutral-700/g, "border-slate-200");
content = content.replace(/border-slate-700\/50/g, "border-slate-200");
content = content.replace(/border-slate-700/g, "border-slate-200");
content = content.replace(/border-slate-600\/80/g, "border-slate-200");
content = content.replace(/border-slate-600/g, "border-slate-300");

// 2. Text Colors
content = content.replace(/text-neutral-400/g, "text-slate-500");
content = content.replace(/text-neutral-300/g, "text-slate-700");
content = content.replace(/text-neutral-200/g, "text-slate-900");
content = content.replace(/text-zinc-500/g, "text-slate-500");
content = content.replace(/text-zinc-400/g, "text-slate-600");
content = content.replace(/text-zinc-300/g, "text-slate-700");
content = content.replace(/text-zinc-200/g, "text-slate-900");

content = content.replace(/text-white mt-0\.5/g, "text-slate-900 mt-0.5");
content = content.replace(/text-white font-bold/g, "text-slate-900 font-bold");
content = content.replace(/text-lg font-black text-white/g, "text-lg font-black text-slate-900");
content = content.replace(/text-base font-bold text-white/g, "text-base font-bold text-slate-900");

// 3. Buttons & Indigo Theme
content = content.replace(/bg-amber-600 hover:bg-amber-500 text-black/g, "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm");
content = content.replace(/bg-amber-950/g, "bg-indigo-50");
content = content.replace(/border-amber-800\/80/g, "border-indigo-200");
content = content.replace(/border-amber-800\/60/g, "border-indigo-200");
content = content.replace(/text-amber-300/g, "text-indigo-700");
content = content.replace(/text-amber-400/g, "text-indigo-600");
content = content.replace(/text-amber-500/g, "text-indigo-600");
content = content.replace(/border-t-amber-500/g, "border-t-indigo-600");
content = content.replace(/border-l-amber-500/g, "border-l-indigo-600");
content = content.replace(/border-amber-600\/50/g, "border-indigo-200");

// Forms bottoms
content = content.replace(/bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold text-sm tracking-wider uppercase transition-all shadow-\[0_0_20px_rgba\(245,158,11,0\.3\)\] cursor-pointer/g, "bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-sm cursor-pointer");
content = content.replace(/bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-950/g, "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm");
content = content.replace(/bg-amber-500 hover:bg-amber-400 text-black/g, "bg-indigo-600 hover:bg-indigo-700 text-white");
content = content.replace(/bg-gradient-to-r from-amber-500 to-yellow-600 text-black/g, "bg-indigo-600 text-white");
content = content.replace(/hover:from-amber-400 hover:to-yellow-500/g, "hover:bg-indigo-700");
content = content.replace(/bg-amber-500 text-black font-bold shadow/g, "bg-indigo-600 text-white font-bold shadow-sm");

// selection color fix
content = content.replace(/selection:bg-amber-600 text-black\/30/g, "selection:bg-indigo-600/30");

// 4. Advanced Component Layout replacements
const oldFilterBar = `<div className="ml-4 border-l border-slate-200 pl-4">
                  <button
                    onClick={handleSyncAISchedule}
                    className="px-3.5 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-mono text-xs font-bold transition-all flex items-center gap-1.5"
                    title="Sync Coordinated AI Shadow Blocks directly to Digital Twin"
                  >
                    SYNC AI SHADOW BLOCKS
                  </button>
                </div>`;

const newFilterBar = `<div className="ml-4 pl-4 border-l border-slate-200">
                  <button
                    onClick={handleSyncAISchedule}
                    className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-sans text-[11px] uppercase tracking-wider font-bold transition-colors flex items-center gap-2"
                  >
                    SYNC AI SCHEDULE
                  </button>
                </div>`;
content = content.replace(oldFilterBar, newFilterBar);

// We will use replace_file_content for the big block render to avoid regex hell in node string escaping
fs.writeFileSync("frontend/src/app/rbms/page.tsx", content, "utf8");

