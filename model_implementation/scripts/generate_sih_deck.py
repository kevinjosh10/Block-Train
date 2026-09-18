import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # High-Tech Dark Modern Color Palette
    C_BG_DARK = RGBColor(8, 14, 26)         # Deep Navy Background #080e1a
    C_CARD_BG = RGBColor(15, 23, 42)        # Card Background #0f172a
    C_CARD_ALT = RGBColor(20, 31, 56)       # Secondary Card #141f38
    C_ACCENT_AMBER = RGBColor(251, 191, 36) # Gold / Amber #fbbf24
    C_ACCENT_CYAN = RGBColor(56, 189, 248)  # Electric Blue #38bdf8
    C_ACCENT_EMERALD = RGBColor(52, 211, 153) # Neon Emerald #34d399
    C_ACCENT_PURPLE = RGBColor(192, 132, 252) # Violet Purple #c084fc
    C_ACCENT_RED = RGBColor(248, 113, 113)  # Crimson Alert #f87171
    C_TEXT_WHITE = RGBColor(255, 255, 255)
    C_TEXT_MUTED = RGBColor(148, 163, 184) # Slate Muted #94a3b8

    def apply_slide_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG_DARK
        bg.line.fill.background()

    def create_header(slide, title, category_tag):
        # Category Pill
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.45), Inches(4.8), Inches(0.35))
        pill.fill.solid()
        pill.fill.fore_color.rgb = RGBColor(24, 38, 68)
        pill.line.color.rgb = C_ACCENT_AMBER
        pill.line.width = Pt(1)
        tf = pill.text_frame
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.text = category_tag.upper()
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = C_ACCENT_AMBER
        p.alignment = PP_ALIGN.CENTER
        
        # Title Text
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.65))
        pt = tb.text_frame.paragraphs[0]
        pt.text = title
        pt.font.size = Pt(22)
        pt.font.bold = True
        pt.font.color.rgb = C_TEXT_WHITE

    # ==============================================================================
    # SLIDE 1: TITLE & EXECUTIVE HERO
    # ==============================================================================
    s1 = prs.slides.add_slide(blank_layout)
    apply_slide_bg(s1)

    tb1_cat = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.6), Inches(5.5), Inches(0.4))
    tb1_cat.fill.solid()
    tb1_cat.fill.fore_color.rgb = RGBColor(24, 38, 68)
    tb1_cat.line.color.rgb = C_ACCENT_AMBER
    tb1_cat.line.width = Pt(1.2)
    p_cat = tb1_cat.text_frame.paragraphs[0]
    p_cat.text = "MINISTRY OF RAILWAYS // PROBLEM STATEMENT 26027"
    p_cat.font.size = Pt(10)
    p_cat.font.bold = True
    p_cat.font.color.rgb = C_ACCENT_AMBER
    p_cat.alignment = PP_ALIGN.CENTER

    tb_title = s1.shapes.add_textbox(Inches(0.8), Inches(1.2), Inches(11.7), Inches(1.8))
    p_t1 = tb_title.text_frame.paragraphs[0]
    p_t1.text = "BLOCKTRAIN: AI-Powered Automatic Block Planning Engine"
    p_t1.font.size = Pt(28)
    p_t1.font.bold = True
    p_t1.font.color.rgb = C_TEXT_WHITE

    p_t2 = tb_title.text_frame.add_paragraph()
    p_t2.text = "Maximizing Fixed Asset Availability & Zero-Conflict Multi-Department Maintenance for Indian Railways"
    p_t2.font.size = Pt(15)
    p_t2.font.color.rgb = C_ACCENT_CYAN

    metrics = [
        ("R² Score", "93.21%", "Continuous MPI Regression Accuracy", C_ACCENT_CYAN),
        ("Emergency Precision", "100.0%", "Zero False Negatives on Fractures", C_ACCENT_EMERALD),
        ("Track Downtime Cut", "> 53%", "Tri-Department Shadow Clubbing", C_ACCENT_AMBER),
        ("Trained Parameters", "20,294", "630 Trees Stacked Ensemble", C_ACCENT_PURPLE)
    ]
    for i, (m_label, m_val, m_sub, m_col) in enumerate(metrics):
        x = Inches(0.8 + i * 2.95)
        card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(3.3), Inches(2.8), Inches(1.8))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = m_col
        card.line.width = Pt(1.5)
        
        tf = card.text_frame
        tf.margin_left = Inches(0.2)
        tf.margin_top = Inches(0.2)
        p_l = tf.paragraphs[0]
        p_l.text = m_label.upper()
        p_l.font.size = Pt(10)
        p_l.font.bold = True
        p_l.font.color.rgb = C_TEXT_MUTED
        
        p_v = tf.add_paragraph()
        p_v.text = m_val
        p_v.font.size = Pt(24)
        p_v.font.bold = True
        p_v.font.color.rgb = m_col
        
        p_s = tf.add_paragraph()
        p_s.text = m_sub
        p_s.font.size = Pt(9)
        p_s.font.color.rgb = C_TEXT_WHITE

    strip = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.4), Inches(11.733), Inches(1.3))
    strip.fill.solid()
    strip.fill.fore_color.rgb = C_CARD_ALT
    strip.line.color.rgb = RGBColor(38, 56, 95)
    strip.line.width = Pt(1)
    tf_s = strip.text_frame
    tf_s.margin_left = Inches(0.3)
    tf_s.margin_top = Inches(0.2)
    p_s1 = tf_s.paragraphs[0]
    p_s1.text = "BENCHMARK ENVIRONMENT // SOUTHERN RAILWAY CHENNAI DIVISION"
    p_s1.font.size = Pt(11)
    p_s1.font.bold = True
    p_s1.font.color.rgb = C_ACCENT_AMBER
    p_s2 = tf_s.add_paragraph()
    p_s2.text = "Trained and validated on the 73 km Quadruple Electrified Trunk Line (Chennai Central MAS - Arakkonam AJJ) with live TMS, SMMS, TDMS, and COA timetable feeds."
    p_s2.font.size = Pt(11)
    p_s2.font.color.rgb = C_TEXT_WHITE

    # ==============================================================================
    # SLIDE 2: THE PROBLEM & WHY CURRENT BDMS FAILS
    # ==============================================================================
    s2 = prs.slides.add_slide(blank_layout)
    apply_slide_bg(s2)
    create_header(s2, "The Core Problem: Departmental Silos in Railway Maintenance", "Current Operational Breakdown")

    problems = [
        ("1. Departmental Silos", "Civil (TMS), Signals (SMMS), and Traction (TDMS) request blocks independently via BDMS without cross-departmental coordination.", C_ACCENT_RED),
        ("2. Redundant Track Closures", "The same 5 km track section is shut down 3 separate times in a week, wasting over 40% of available traffic capacity.", C_ACCENT_AMBER),
        ("3. Freight Chokepoints", "Unplanned daytime maintenance forces heavy freight rakes to stop at red signals, causing severe corridor congestion waves.", C_ACCENT_RED),
        ("4. Disconnected Timetables", "Block planning lacks live sync with the Control Office Application (COA), risking delays to premium trains like Vande Bharat.", C_ACCENT_AMBER)
    ]

    for i, (p_tit, p_txt, p_col) in enumerate(problems):
        row = i // 2
        col = i % 2
        x = Inches(0.8 + col * 5.95)
        y = Inches(1.8 + row * 2.55)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.75), Inches(2.25))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = p_col
        card.line.width = Pt(1.5)
        
        tf = card.text_frame
        tf.margin_left = Inches(0.3)
        tf.margin_top = Inches(0.25)
        pt = tf.paragraphs[0]
        pt.text = p_tit
        pt.font.size = Pt(14)
        pt.font.bold = True
        pt.font.color.rgb = p_col
        
        pd = tf.add_paragraph()
        pd.text = p_txt
        pd.font.size = Pt(11)
        pd.font.color.rgb = C_TEXT_WHITE

    # ==============================================================================
    # SLIDE 3: 5-LAYER HIERARCHICAL AI ARCHITECTURE
    # ==============================================================================
    s3 = prs.slides.add_slide(blank_layout)
    apply_slide_bg(s3)
    create_header(s3, "Our Two-Stage 5-Layer AI Architecture: How the Model Works", "End-to-End Deep Pipeline")

    layers = [
        ("Layer 1: Sensor Ingestion", "Ingests 39 features across TMS, SMMS, and TDMS. Normalizes scale differences.", C_ACCENT_CYAN),
        ("Layer 2: Interaction Physics", "Computes non-linear terms: Risk x Overdue and Risk x Asset Age for fatigue curves.", C_ACCENT_PURPLE),
        ("Layer 3: MPI Regressor", "150 Boosted Trees synthesize the continuous 0-100 Maintenance Priority Index (R² = 93.21%).", C_ACCENT_RED),
        ("Layer 4: Safety Classifier", "480 Trees with Asymmetric Safety Shield enforce 100% Precision on Emergency defects.", C_ACCENT_AMBER),
        ("Layer 5: Spatial Shadow Actuator", "Clubs Civil + S&T + TRD jobs within +/-2.5 km into single slot & triggers Red Interlocking.", C_ACCENT_EMERALD)
    ]

    for i, (l_tit, l_desc, l_col) in enumerate(layers):
        x = Inches(0.8 + i * 2.37)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.8), Inches(2.25), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = l_col
        card.line.width = Pt(1.5)
        
        tf = card.text_frame
        tf.margin_left = Inches(0.18)
        tf.margin_top = Inches(0.25)
        
        p_num = tf.paragraphs[0]
        p_num.text = f"STAGE 0{i+1}"
        p_num.font.size = Pt(9)
        p_num.font.bold = True
        p_num.font.color.rgb = l_col
        
        p_t = tf.add_paragraph()
        p_t.text = l_tit
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = C_TEXT_WHITE
        
        p_d = tf.add_paragraph()
        p_d.text = l_desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = C_TEXT_MUTED

    # ==============================================================================
    # SLIDE 4: THE 4 CORE BREAKTHROUGH USPs
    # ==============================================================================
    s4 = prs.slides.add_slide(blank_layout)
    apply_slide_bg(s4)
    create_header(s4, "Why BlockTrain Is Untouchable: The 4 Core USPs", "Proprietary Innovations")

    usps_full = [
        ("1. Spatial Shadow-Block Clustering", "MILP Mathematical Optimizer dynamically clusters Civil, S&T, and TRD jobs within +/-2.5 km into a single coordinated window - slashing track closures by >53%.", C_ACCENT_CYAN),
        ("2. 100% Emergency Precision Shield", "Zero False Negatives on structural flaws. The asymmetric safety loss function guarantees all 16/16 ultrasonic rail cracks are caught with 100% emergency precision.", C_ACCENT_EMERALD),
        ("3. 4-Tier Sunlight & Machine Slotting", "Routes visual USFD to daylight midday lulls (11:30-14:30) per IRPWM rules, heavy tamping machines to night floodlights, and micro-gaps between express runs.", C_ACCENT_AMBER),
        ("4. Legal Ops Memo & Kavach Ready", "Auto-generates Indian Railways Form T/409 Disconnection Memos, locks Red Signals, and transmits Kavach IR-TCAS-01 speed restriction packets directly to loco cabs.", C_ACCENT_RED)
    ]

    for i, (u_tit, u_desc, u_col) in enumerate(usps_full):
        row = i // 2
        col = i % 2
        x = Inches(0.8 + col * 5.95)
        y = Inches(1.8 + row * 2.55)
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.75), Inches(2.25))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = u_col
        card.line.width = Pt(1.5)
        
        tf = card.text_frame
        tf.margin_left = Inches(0.3)
        tf.margin_top = Inches(0.25)
        pt = tf.paragraphs[0]
        pt.text = u_tit
        pt.font.size = Pt(14)
        pt.font.bold = True
        pt.font.color.rgb = u_col
        
        pd = tf.add_paragraph()
        pd.text = u_desc
        pd.font.size = Pt(11)
        pd.font.color.rgb = C_TEXT_WHITE

    # ==============================================================================
    # SLIDE 5: MODEL PERFORMANCE & VERIFICATION
    # ==============================================================================
    s5 = prs.slides.add_slide(blank_layout)
    apply_slide_bg(s5)
    create_header(s5, "Verified Model Performance & Empirical Validation", "Real Corridor Benchmark")

    stats = [
        ("R² Score (MPI Regressor)", "93.21%", C_ACCENT_CYAN),
        ("Mean Absolute Error (MAE)", "3.41 points / 100", C_ACCENT_CYAN),
        ("Multi-Class Accuracy", "87.66%", C_ACCENT_EMERALD),
        ("Emergency Safety Precision", "100.00% (Zero False Neg)", C_ACCENT_EMERALD),
        ("Trained Parameter Count", "20,294 (630 Trees)", C_ACCENT_PURPLE),
        ("CPU Inference Latency", "1.2 ms per defect", C_ACCENT_AMBER)
    ]

    for i, (s_lbl, s_val, s_col) in enumerate(stats):
        y = Inches(1.8 + i * 0.8)
        row_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(5.6), Inches(0.68))
        row_box.fill.solid()
        row_box.fill.fore_color.rgb = C_CARD_BG
        row_box.line.color.rgb = RGBColor(38, 56, 95)
        row_box.line.width = Pt(1)
        
        tf = row_box.text_frame
        tf.margin_left = Inches(0.2)
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.text = f"{s_lbl}: "
        p.font.size = Pt(11)
        p.font.color.rgb = C_TEXT_MUTED
        run = p.add_run()
        run.text = s_val
        run.font.bold = True
        run.font.color.rgb = s_col

    cm_card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.733), Inches(4.8))
    cm_card.fill.solid()
    cm_card.fill.fore_color.rgb = C_CARD_BG
    cm_card.line.color.rgb = C_ACCENT_EMERALD
    cm_card.line.width = Pt(1.5)

    tf_cm = cm_card.text_frame
    tf_cm.margin_left = Inches(0.3)
    tf_cm.margin_top = Inches(0.3)

    p_cm1 = tf_cm.paragraphs[0]
    p_cm1.text = "CONFUSION MATRIX (UNSEEN TEST DATA)"
    p_cm1.font.size = Pt(13)
    p_cm1.font.bold = True
    p_cm1.font.color.rgb = C_ACCENT_EMERALD

    cm_lines = [
        "Actual CRITICAL (16):  16 Correct | 0 Missed (100% Recall / 100% Prec)",
        "Actual HIGH (48):      42 Correct | 6 Planned (87.5% Recall)",
        "Actual MEDIUM (62):    49 Correct | 10 High / 3 Routine",
        "Actual ROUTINE (28):   28 Correct | 0 False Alarm (100% Precision)",
        "-------------------------------------------------------",
        "KEY SAFETY TAKEAWAY: Zero Critical Emergency defects were down-ranked. The asymmetric safety shield prevents catastrophic rail fractures from ever being missed."
    ]
    for line in cm_lines:
        p_l = tf_cm.add_paragraph()
        p_l.text = line
        p_l.font.size = Pt(10)
        p_l.font.color.rgb = C_TEXT_WHITE if "KEY" not in line else C_ACCENT_AMBER

    # ==============================================================================
    # SLIDE 6: BUSINESS IMPACT & ESG ROI
    # ==============================================================================
    s6 = prs.slides.add_slide(blank_layout)
    apply_slide_bg(s6)
    create_header(s6, "Measurable Operational & Financial Impact on Indian Railways", "Business ROI & Mission 2030")

    impacts = [
        ("> 53% Track Downtime Cut", "By replacing 3 separate departmental blocks with 1 unified shadow window, track possession hours drop from 36h to 14h weekly.", C_ACCENT_CYAN),
        ("Zero Passenger Timetable Impact", "Maintains 100% on-time punctuality for Vande Bharat and Express trains by regulating freight traffic on loop lines.", C_ACCENT_EMERALD),
        ("₹35+ Lakhs Weekly Savings", "Eliminates freight detention penalties and avoids duplicate track tamping machine haulage trips across sidings.", C_ACCENT_AMBER),
        ("Net-Zero Carbon Mission 2030", "Prevents 14 unscheduled freight stops weekly, saving 3,200 kWh of 25kV electric power and 2.6 tonnes of CO2 emissions.", C_ACCENT_PURPLE)
    ]

    for i, (i_tit, i_desc, i_col) in enumerate(impacts):
        row = i // 2
        col = i % 2
        x = Inches(0.8 + col * 5.95)
        y = Inches(1.8 + row * 2.55)
        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.75), Inches(2.25))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD_BG
        card.line.color.rgb = i_col
        card.line.width = Pt(1.5)
        
        tf = card.text_frame
        tf.margin_left = Inches(0.3)
        tf.margin_top = Inches(0.25)
        pt = tf.paragraphs[0]
        pt.text = i_tit
        pt.font.size = Pt(14)
        pt.font.bold = True
        pt.font.color.rgb = i_col
        
        pd = tf.add_paragraph()
        pd.text = i_desc
        pd.font.size = Pt(11)
        pd.font.color.rgb = C_TEXT_WHITE

    target_path = "BlockTrain_SIH_Winning_Presentation.pptx"
    prs.save(target_path)
    print(f"[SUCCESS] Saved 6-slide SIH master presentation to: {os.path.abspath(target_path)}")

if __name__ == "__main__":
    build_presentation()
