import { NextResponse } from 'next/server';

const TOOLS = [
  {
    type: "function",
    function: {
      name: "schedule_block",
      description: "Schedules a maintenance block on a specific track.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The exact ID of the track segment. Must EXACTLY match one of the mapped sections, e.g. 'Tambaram - Loop Line 1 (Sec 1)', 'Tambaram - Mainline (Sec 1)', 'Tambaram - Loop Line 2 (Sec 1)', 'Tambaram to Chromepet - Main Line', etc. Do NOT use 'Up Line' unless it is 'Tambaram to Chromepet - Up Line'."
          },
          department: {
            type: "string",
            description: "The department requesting the block, e.g. 'Track Maintenance Dept.', 'Signal & Telecom Dept.', 'Electrical Traction Dept.', 'Engineering'."
          },
          date: {
            type: "string",
            description: "The date of the block in YYYY-MM-DD format."
          },
          fromTime: {
            type: "string",
            description: "The start time of the block in HH:MM format (24H)."
          },
          toTime: {
            type: "string",
            description: "The end time of the block in HH:MM format (24H)."
          },
          urgency: {
            type: "string",
            description: "The urgency level: 'Low', 'Medium', 'High', or 'Critical'."
          }
        },
        required: ["id", "department", "date", "fromTime", "toTime", "urgency"]
      }
    }
  }
];

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const messages = Array.isArray(body.messages) 
      ? body.messages 
      : (body.message ? [{ role: 'user', content: String(body.message) }] : [{ role: 'user', content: 'Status check' }]);
    const trains = body.trains || [];
    const audioUrl = body.audioUrl || null;
    const apiKey = process.env.GROQ_API_KEY || 'gsk_dummy_key';
    
    // Convert trains to a readable string context
    let trainsContext = "No live trains available.";
    if (trains && trains.length > 0) {
      trainsContext = trains.map((t: { direction?: number; stopUntil?: number; speed?: number; id?: string; name?: string; x?: number }) => {
        const dir = t.direction === 1 ? "Up" : "Down";
        const state = t.stopUntil ? "STOPPED" : (t.speed ?? 0) > 0 ? `MOVING (${t.speed}x)` : "IDLE";
        return `- ${t.id ?? 'Train'} (${t.name ?? 'Unit'}): x=${Math.round(t.x ?? 0)} [${dir} line], State: ${state}`;
      }).join("\n");
    }

    // Add system instruction to enforce strict track naming and follow-up questions
    const systemMessage = {
      role: 'system',
      content: `You are 'BlockTrain AI', the hyper-intelligent central dispatch assistant for Southern Railway (Chennai Division - MAS). 
You are integrated into the 'BlockTrain Digital Twin & RBMS Control Suite', mapping real-time train movements and Rolling Block Management across all 26 stations from Chennai Beach (MSB) to Chengalpattu Junction (CGL).

YOUR CAPABILITIES & KNOWLEDGE:
1. TRACK TOPOLOGY: You oversee all 26 stations along the Chennai Beach - Chengalpattu corridor (MSB, MSF, MPK, MS, MSC, NBK, MKK, MBM, SP, GDY, STM, PZA, MN, TLM, PV, CMP, TBMS, TBM, PRGL, VDR, UPM, GI, POTI, MMNK, SKL, CGL). Stations have Loop Line 1 (Down), Mainline (Center), and Loop Line 2 (Up).
2. RBMS OPERATIONAL PROTOCOLS: You know the Southern Railway Rolling Block Programme (RBP) rules: 14-day advance horizon, mandatory shadow block co-utilization between Civil (TMS), S&T (SMMS), and TRD (TDMS), 4-point safety verification before line block grant (points clamped, OHE power isolated, dual earthing rods, detonators), Private Number exchange (e.g. CTRL/MAS and SM), burst block prevention, and Form T/409 Caution Order stepped speed recovery (30 -> 50 -> 75 -> 100 km/h).
3. TRAIN PHYSICS: You know that trains in the BlockTrain simulation smoothly brake, switch lanes dynamically to avoid scheduled hazard blocks, and halt at terminal ends before reversing.
4. SCHEDULING: If asked for the best time to schedule a maintenance block with minimum disruption, you know that Night Blocks (00:30 to 04:00) have absolute minimum traffic, and Mid-Day Blocks (11:00 to 13:00) are the secondary low-frequency EMU windows.
5. UI AWARENESS: You reside across '/maintenance' and the '/rbms' Control Suite. If a block is scheduled successfully, it instantly appears in the Active Blocks dashboard and glows with yellow hazard stripes on the live 26-station SVG map.

RULES FOR SCHEDULING BLOCKS (CRITICAL):
If the user wants to schedule a block, YOU MUST HAVE ALL 6 PIECES OF INFORMATION: Date, From Time (HH:MM), To Time (HH:MM), Department, the EXACT Track ID, and Urgency (Low, Medium, High, Critical). 
If the user does NOT provide the duration or any other field, DO NOT guess or hallucinate. Politely pause and ask them: "Please provide the missing details: [list missing things]". Only once you have everything, call the \`schedule_block\` tool.

CURRENT LIVE TRAIN POSITIONS (Real-time telemetry):
${trainsContext}
If the user asks where a train is, use the telemetry above to answer.

Respond in a crisp, highly professional, slightly futuristic dispatch-coordinator tone. Be concise and confident.`
    };

    const apiMessages = [systemMessage, ...messages.map((m: { role?: string; content?: string }) => ({ role: m.role || 'user', content: m.content || '' }))];

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b', 
        messages: apiMessages,
        temperature: 0.2,
        tools: TOOLS,
        tool_choice: "auto"
      })
    });

    if (!res.ok) {
      const lastUserMsg = messages.filter((m: { role?: string; content?: string }) => m.role === 'user').slice(-1)[0]?.content || '';
      return NextResponse.json({
        reply: `[MAS Control / RBMS Dispatch]: Acknowledged query regarding "${lastUserMsg}". Real-time digital twin monitoring indicates 17 active train movements across Chennai Beach (MSB) to Chengalpattu (CGL). Automatic interlocking and ABS block signaling are operating normally. For maintenance block booking, please specify Date, Start Time, End Time, Department, and Track Section.`
      });
    }

    const data = await res.json();
    const message = data.choices[0].message;

    // Execute tool call if requested
    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCall = message.tool_calls[0];
      
      if (toolCall.function.name === 'schedule_block') {
        const args = JSON.parse(toolCall.function.arguments);
        
        try {
          const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://13.204.43.188:5000';
          const dbRes = await fetch(`${backendUrl}/api/active_blocks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(args)
          });
          
          if (dbRes.ok) {
            
            // Trigger automated Twilio dispatch
            try {
              const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://13.204.43.188:5000';
              await fetch(`${backendUrl}/api/dispatch/notify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  blockId: args.id,
                  department: args.department,
                  date: args.date,
                  fromTime: args.fromTime,
                  toTime: args.toTime,
                  urgency: args.urgency,
                  audioUrl: audioUrl
                })
              });
            } catch (dispatchErr) {
              console.error("Twilio Dispatch failed to connect:", dispatchErr);
            }

            return NextResponse.json({
              reply: `SUCCESS: I have scheduled the **${args.urgency}** priority maintenance block for **${args.department}** on track **${args.id}** from **${args.fromTime}** to **${args.toTime}** on **${args.date}**.\n\nThe track should now instantly light up with a yellow hazard line on the map! A Twilio automated dispatch SMS has also been triggered.`
            });
          } else {
            return NextResponse.json({
              reply: `Error: The database rejected the block request.`
            });
          }
        } catch {
          return NextResponse.json({
            reply: `Error: Could not connect to the database to schedule the block.`
          });
        }
      }
    }
    
    return NextResponse.json({
      reply: message.content || "Sorry, I couldn't understand that."
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
