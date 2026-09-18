
const fs = require("fs");
let content = fs.readFileSync("frontend/src/app/ai-planner/page.tsx", "utf8");

// Backgrounds
content = content.replace(/bg-slate-950/g, "bg-slate-50");
content = content.replace(/bg-zinc-950/g, "bg-slate-50"); // For inputs
content = content.replace(/bg-slate-900/g, "bg-white");
content = content.replace(/bg-zinc-900/g, "bg-white");
content = content.replace(/bg-slate-800/g, "bg-slate-100");
content = content.replace(/bg-zinc-800/g, "bg-slate-100");
content = content.replace(/bg-\[#0a0d14\]/g, "bg-white");
content = content.replace(/bg-\[#0c1018\]/g, "bg-white");

// Borders
content = content.replace(/border-slate-800/g, "border-slate-200");
content = content.replace(/border-zinc-800/g, "border-slate-200");
content = content.replace(/border-slate-700/g, "border-slate-200");
content = content.replace(/border-zinc-700/g, "border-slate-200");
content = content.replace(/border-slate-600/g, "border-slate-300");
content = content.replace(/border-zinc-600/g, "border-slate-300");

// Text Colors
content = content.replace(/text-slate-200/g, "text-slate-900");
content = content.replace(/text-zinc-200/g, "text-slate-900");
content = content.replace(/text-slate-300/g, "text-slate-700");
content = content.replace(/text-zinc-300/g, "text-slate-700");
content = content.replace(/text-slate-400/g, "text-slate-500");
content = content.replace(/text-zinc-400/g, "text-slate-500");
content = content.replace(/text-slate-500/g, "text-slate-500");
content = content.replace(/text-zinc-500/g, "text-slate-500");

// Change `text-white` carefully so buttons keep white text but headings become dark
content = content.replace(/text-white/g, "text-slate-900");

// Now restore `text-white` for buttons that need it
// We know indigo-600 buttons need white text. 
content = content.replace(/bg-indigo-600 hover:bg-indigo-700 text-slate-900/g, "bg-indigo-600 hover:bg-indigo-700 text-white");
content = content.replace(/bg-emerald-600 hover:bg-emerald-500 text-slate-900/g, "bg-emerald-600 hover:bg-emerald-700 text-white");

// Indigo Theme
content = content.replace(/bg-blue-600/g, "bg-indigo-600 text-white shadow-sm");
content = content.replace(/hover:bg-blue-500/g, "hover:bg-indigo-700");
content = content.replace(/bg-blue-500/g, "bg-indigo-500");
content = content.replace(/text-blue-400/g, "text-indigo-600");
content = content.replace(/text-cyan-400/g, "text-indigo-600");
content = content.replace(/text-cyan-500/g, "text-indigo-600");
content = content.replace(/focus:border-cyan-500/g, "focus:border-indigo-500");
content = content.replace(/border-cyan-500\/30/g, "border-indigo-200");
content = content.replace(/bg-cyan-500\/10/g, "bg-indigo-50");
content = content.replace(/shadow-\[0_0_20px_rgba\(6,182,212,0\.2\)\]/g, "shadow-sm");
content = content.replace(/shadow-\[0_0_15px_rgba\(59,130,246,0\.3\)\]/g, "shadow-sm");

// selection color
content = content.replace(/selection:bg-blue-600\/30/g, "selection:bg-indigo-600/30");

// specific fix for any redundant text-slate-900 text-white
content = content.replace(/text-slate-900 text-white/g, "text-white");
content = content.replace(/text-white text-slate-900/g, "text-white");

// Re-write back to file
fs.writeFileSync("frontend/src/app/ai-planner/page.tsx", content, "utf8");

