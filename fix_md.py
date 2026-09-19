import sys
import re

with open('docs/BLOCKTRAIN_MASTER_PROJECT_CONTEXT.md', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Replace corrupted table with a clean markdown table
start_idx = content.find('\\\')
# Find the end of the code block. It ends with '\\\'
end_idx = content.find('### 2.1')

if start_idx != -1 and end_idx != -1:
    new_table = '''
### 2.0 BLOCKTRAIN TECHNOLOGY STACK

| SUBSYSTEM | TECHNOLOGIES / LIBRARIES | OPERATIONAL PURPOSE |
|---|---|---|
| **1. AI / ML Prioritizer** | Python 3.11, Scikit-Learn, XGBoost, NumPy, Pandas, Joblib | Two-Stage Stacked Ensemble: 150 Regressor + 480 Classif. RA = 93.21%, 100% Emerg Prec |
| **2. Exact Mathematical Optimization** | PuLP (CBC Solver), Google OR-Tools (CP-SAT Constraint Programming Solver) | Solves spatial shadow block clustering (Δ2.5 km) and discrete time intervals |
| **3. Spatial & Conflict Topology** | NetworkX, PostGIS / PostgreSQL, SpatialIndex | Graph-theoretic track section conflict modeling (G=(V, E)) |
| **4. Timetable Ingestion & Simulation** | Custom WTT / COA Parser, Regex Timetable Engine, Monte Carlo Simulator | Parses Working Time Tables, headways, 45+ daily runs |
| **5. Backend REST API** | Node.js (Express), Python (Flask/HTTP) | High-throughput REST API (Port 5000/5001, 1.2ms latency) |
| **6. Dispatch Console & UI Visualizations** | Next.js 14 (App Router), Tailwind CSS, React Gantt Timeline, Plotly | Interactive yard dispatcher, track map, neural visualizer |
| **7. Legal & Regulatory Automation** | PDF Engine, G&SR Template Parser, Signal Interlocking Emulation | Auto-generates legal Indian Railways Form T/409 Memos |
| **8. Hardware & Field Grassroots Safety** | Kavach 4.0 Packet Encoder, Twilio SMS API, OpenCV Weld Audit | Broadcasts TSR to locos; bilingual gang alerts + photo |
| **9. Cloud & Security Infrastructure** | AWS EC2, AWS RDS, AWS VPC, AWS SSM, Docker, Vercel, Helmet.js | Zero-Trust Hybrid Cloud, Anti-DDoS rate limits, Edge caching |

'''
    
    # Actually, we need to make sure we replace the right block.
    # We will just replace everything between 'OFFICIAL REQUIREMENTS VERIFICATION MATRIX' and '### 2.1' with the new table
    # Wait, the official requirements matrix is ALSO a corrupted ASCII table!
    
    # Let's replace the whole top section down to 2.1
    match_start = content.find('1. CORE ARCHITECTURE & TECHNOLOGY STACK')
    
    new_content = content[:match_start] + '''1. CORE ARCHITECTURE & TECHNOLOGY STACK

''' + new_table + '''

### 1.1 OFFICIAL REQUIREMENTS VERIFICATION MATRIX (Indian Railways)

| OFFICIAL REQUIREMENT | BLOCKTRAIN IMPLEMENTATION | STATUS |
|---|---|---|
| **1. Multi-Department Data Integration** (TMS, SMMS, TDMS, COA Timetable) | Unified ingestion of TMS, SMMS, TDMS, and COA live schedules into a 39-feature tensor. | ✅ **100% COMPLETE** (Verified on 770 SR work orders) |
| **2. AI/ML Criticality & Urgency Prioritization** | Two-Stage Stacked GBDT Ensemble (630 Trees, 20k+ Params, MPI 0-100 & 4 Urgency Tiers). | ✅ **100% COMPLETE** (RA = 93.21%, 100% Emerg. Precision) |
| **3. Coordinated Multi-Dept Scheduling** (Minimize Downtime & Redundancy) | MILP Spatial Shadow-Clustering Engine (Δ2.5 km grouping, 4-Tier Sunlight & Machine Slotting). | ✅ **100% COMPLETE** (>53% Downtime Cut: 36h -> 14h weekly) |
| **4. Multi-Horizon Block Plans** (Weekly & Monthly Horizons) | Dual Rolling Block Plan (7-Day Tactical + 30-Day Strategic). | ✅ **100% COMPLETE** (Dynamic insertion) |
| **5. Operational Field Deployment & Safety Integration** | Form T/409 Disconnection Memos, Kavach 4.0 ATP Radio, and Bot. | ✅ **100% COMPLETE** (Zero train disruption) |

''' + content[end_idx:]

    new_content = new_content.replace('saving ,150+', 'saving ₹150+')
    new_content = new_content.replace('', '')

    with open('docs/BLOCKTRAIN_MASTER_PROJECT_CONTEXT.md', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("Fixed markdown")
