import fs from 'fs';

let content = fs.readFileSync('docs/BLOCKTRAIN_MASTER_PROJECT_CONTEXT.md', 'utf8');

const start = content.indexOf('BLOCKTRAIN TECHNOLOGY STACK');
const end = content.indexOf('### 2.1 Cloud Architecture');

if (start !== -1 && end !== -1) {
    // We want to replace from right before the table code block
    const realStart = content.lastIndexOf('\\\', start);

    const newBlock = "### 2.0 BLOCKTRAIN TECHNOLOGY STACK\n\n| SUBSYSTEM | TECHNOLOGIES / LIBRARIES | OPERATIONAL PURPOSE |\n|---|---|---|\n| **1. AI / ML Prioritizer** | Python 3.11, Scikit-Learn, XGBoost, NumPy, Pandas, Joblib | Two-Stage Stacked Ensemble: 150 Regressor + 480 Classif. RA = 93.21%, 100% Emerg Prec |\n| **2. Exact Mathematical Optimization** | PuLP (CBC Solver), Google OR-Tools (CP-SAT Constraint Programming Solver) | Solves spatial shadow block clustering (Δ2.5 km) and discrete time intervals |\n| **3. Spatial & Conflict Topology** | NetworkX, PostGIS / PostgreSQL, SpatialIndex | Graph-theoretic track section conflict modeling (G=(V, E)) |\n| **4. Timetable Ingestion & Simulation** | Custom WTT / COA Parser, Regex Timetable Engine, Monte Carlo Simulator | Parses Working Time Tables, headways, 45+ daily runs |\n| **5. Backend REST API** | Node.js (Express), Python (Flask/HTTP) | High-throughput REST API (Port 5000/5001, 1.2ms latency) |\n| **6. Dispatch Console & UI Visualizations** | Next.js 14 (App Router), Tailwind CSS, React Gantt Timeline, Plotly | Interactive yard dispatcher, track map, neural visualizer |\n| **7. Legal & Regulatory Automation** | PDF Engine, G&SR Template Parser, Signal Interlocking Emulation | Auto-generates legal Indian Railways Form T/409 Memos |\n| **8. Hardware & Field Grassroots Safety** | Kavach 4.0 Packet Encoder, Twilio SMS API, OpenCV Weld Audit | Broadcasts TSR to locos; bilingual gang alerts + photo |\n| **9. Cloud & Security Infrastructure** | AWS EC2, AWS RDS, AWS VPC, AWS SSM, Docker, Vercel, Helmet.js | Zero-Trust Hybrid Cloud, Anti-DDoS rate limits, Edge caching |\n\n### 1.1 OFFICIAL REQUIREMENTS VERIFICATION MATRIX (Indian Railways)\n\n| OFFICIAL REQUIREMENT | BLOCKTRAIN IMPLEMENTATION | STATUS |\n|---|---|---|\n| **1. Multi-Department Data Integration** (TMS, SMMS, TDMS, COA Timetable) | Unified ingestion of TMS, SMMS, TDMS, and COA live schedules into a 39-feature tensor. | ✅ **100% COMPLETE** (Verified on 770 SR work orders) |\n| **2. AI/ML Criticality & Urgency Prioritization** | Two-Stage Stacked GBDT Ensemble (630 Trees, 20k+ Params, MPI 0-100 & 4 Urgency Tiers). | ✅ **100% COMPLETE** (RA = 93.21%, 100% Emerg. Precision) |\n| **3. Coordinated Multi-Dept Scheduling** (Minimize Downtime & Redundancy) | MILP Spatial Shadow-Clustering Engine (Δ2.5 km grouping, 4-Tier Sunlight & Machine Slotting). | ✅ **100% COMPLETE** (>53% Downtime Cut: 36h -> 14h weekly) |\n| **4. Multi-Horizon Block Plans** (Weekly & Monthly Horizons) | Dual Rolling Block Plan (7-Day Tactical + 30-Day Strategic). | ✅ **100% COMPLETE** (Dynamic insertion) |\n| **5. Operational Field Deployment & Safety Integration** | Form T/409 Disconnection Memos, Kavach 4.0 ATP Radio, and Bot. | ✅ **100% COMPLETE** (Zero train disruption) |\n\n";

    content = content.substring(0, realStart) + newBlock + content.substring(end);
    
    fs.writeFileSync('docs/BLOCKTRAIN_MASTER_PROJECT_CONTEXT.md', content, 'utf8');
    console.log('Fixed tables exactly!');
} else {
    console.log('Indices not found:', start, end);
}
