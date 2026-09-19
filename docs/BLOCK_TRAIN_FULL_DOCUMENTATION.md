# BlockTrain Full Project Documentation

## 1. Project Overview

**BlockTrain** is a brutalist, high-performance digital twin and simulation dashboard for the Southern Railway (Chennai Suburban Network). It modernizes railway dispatch and maintenance operations by mapping real-time train movements between Tambaram and Chromepet with extreme precision. 

The system provides autonomous predictive routing with multi-lane crossover intelligence, an interactive maintenance block scheduling system, and an AI dispatch assistant that integrates with Twilio for automated crew notifications.

## 2. Key Features

- **Autonomous Predictive Routing:** Trains independently scan multi-lane track topologies using localized radii to safely navigate crossovers and bypass hazards without deadlocking.
- **AI Dispatch Assistant:** An integrated, context-aware chatbot (using Groq models) that acts as a central dispatch coordinator, allowing users to naturally schedule maintenance blocks using natural language.
- **Live Telemetry & Digital Twin:** Real-time canvas visualization of train speeds, braking distances, lane switching, and terminal reversing.
- **Dynamic Maintenance Scheduling:** Interactive block dropping with multi-tier urgency levels (Low, Medium, High, Critical) and instant physical disruption enforcement.
- **Twilio Dispatch Integration:** Automatically alerts field operators and maintenance crews via voice and SMS when a block is scheduled or modified, with audio generation for voice summaries.

## 3. Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **UI Library:** React, Tailwind CSS
- **State Management:** Zustand
- **Map & Canvas:** SVGs, `react-zoom-pan-pinch` for panning and zooming.
- **Icons:** Lucide React

### Backend
- **Framework:** Node.js with Express.js
- **Database:** PostgreSQL (with `pg` driver)
- **External APIs:** 
  - Twilio (SMS & Voice Calls)
  - Groq (LLM for Chatbot Assistant)
  - Cloudinary (For uploading voice recordings/assets)

## 4. Directory Architecture & File Details

### `frontend/src/` (Next.js Application)

#### `app/` (Pages & API Routes)
- `layout.tsx` & `globals.css`: Global application wrappers and brutalist Tailwind CSS injections.
- `page.tsx`: The main landing page.
- `login/page.tsx`: Authentication/Login page.
- `map/page.tsx`: The isolated, full-screen Live Digital Twin viewer (hardcoded to dark mode).
- `maintenance/page.tsx`: The core operator dashboard. Contains the track selection, block scheduling form with Urgency selectors, the miniature map view, and the AI chatbot toggle.
- `workers/page.tsx`: Dashboard for managing field workers and their current locations/status.
- `api/chat/route.ts`: API route communicating with Groq to power the AI dispatch assistant. Includes tool-calling capabilities to schedule blocks directly into the DB.
- `api/upload/route.ts`: Handles file/audio uploads from the frontend.

#### `components/`
- **`audio/`**
  - `VoiceRecorder.tsx`: Component to record voice commands for dispatch operations.
- **`chat/`**
  - `Chatbot.tsx`: The floating AI Dispatch Assistant interface on the maintenance page.
- **`map/`**
  - `DigitalTwinMap.tsx`: The massive SVG-based canvas that wraps the static infrastructure and live trains. Uses `react-zoom-pan-pinch`.
- **`track/`**
  - `StaticInfrastructure.tsx`: Draws the exact geometry of the Southern Railway stations (Tambaram to Chromepet) including platforms, yards, and crossovers.
  - `TrackLine.tsx` & `TrackCurve.tsx`: Reusable SVG paths for straight rails and S-curves.
  - `EntryExitTracks.tsx`: Visuals for the boundaries of the simulated map.
- **`train/`**
  - `LiveTrains.tsx`: The controller component that maps the `useTrainPhysics` state to visual train components on the track.
  - `Locomotive.tsx` & `Coach.tsx`: SVG rendering of the trains.
  - `Headlight.tsx` & `BrakeGlow.tsx`: Visual neon effects representing train direction and braking status.
  - `TelemetryTag.tsx`: Live floating HUD over each train displaying speed, lane, and ID.
- **`ui/`**
  - `CustomCalendar.tsx`, `CustomSelect.tsx`: Highly styled brutalist UI inputs.
  - `DashboardHUD.tsx`: Floating top-left display showing current simulated time.
  - `SpeedController.tsx`: Floating widget to speed up or slow down the physics simulation.

#### `lib/` (Core Logic & Physics)
- `store.ts`: Zustand global state store managing active blocks, live trains, and API synchronization.
- `constants.ts`: Physical constants for the map (spacing, track gap, etc.).
- `stations.ts`: The hardcoded physical topology of Tambaram, Chromepet, etc., defining yard bounds and platform offsets.
- `types.ts`: TypeScript interfaces for `Train`, `Station`, `ActiveBlock`.
- **`hooks/`**
  - `useClock.ts`: Real-time simulated clock.
  - `useTrainPhysics.ts`: **The core mathematical engine of the project.** Calculates predictive braking, scans adjacent lanes for hazards, handles S-curve lane crossovers, collision shields, and deadlocks.
- **`utils/`**
  - `trackGeometry.ts`: Helper functions to calculate exact Y-coordinates for `Mainline`, `Loop Line 1`, and `Loop Line 2`.

---

### `apps/api/src/` (Express Backend)

- `server.js` & `app.js`: Entry points initializing the Express server and attaching modular routes.
- **`core/`**
  - `db.js`: PostgreSQL connection pool wrapper.
- **`modules/blocks/`**
  - `block.controller.js`: Handles HTTP requests for fetching, creating, and deleting maintenance blocks.
  - `block.service.js`: Core business logic for active blocks.
  - `block.model.js`: Raw SQL queries (`SELECT`, `INSERT ON CONFLICT`, `DELETE`) mapping to the `active_blocks` table (including the `urgency` column).
  - `block.routes.js`: Express router linking endpoints to controllers.
- **`modules/chatbot/`**
  - `chatbot.service.js`, `grok.client.js`, `prompts.js`: Backend alternatives for chatbot logic (though the frontend `api/chat` takes priority in the Next.js setup).
- **`modules/dispatch/`**
  - `dispatch.controller.js`, `dispatch.service.js`: Core integration with Twilio. Takes newly scheduled blocks and blasts SMS/Voice notifications to field engineers.
  - `cloudinary.service.js`: Handles uploading audio files to Cloudinary to be played over Twilio Voice calls.
- **`modules/workers/`**
  - CRUD operations mapping to the workers dashboard to track crew locations.
- **`scripts/`**
  - `initDb.js`, `migrate_urgency.js`, `seed.js`: Standalone Node scripts used to initialize and migrate the PostgreSQL tables.

## 5. Deep Dive: Physics Engine (`useTrainPhysics.ts`)

The true complexity of the application lies in `useTrainPhysics.ts`, which runs a 60fps game-loop style simulation on the frontend.
1. **Hazard Mapping**: Maps DB blocks (`"Tambaram - Loop Line 1 (Sec 1)"`) to pixel-perfect bounding boxes (`minX`, `maxX`) on specific Y-lanes.
2. **Lookahead Radar**: Trains constantly scan `2500px` ahead. If a hazard or another train is detected in their active lane, they begin a smooth deceleration curve based on momentum.
3. **Intelligent Crossovers**: If a hazard is blocking the current lane, the train scans `lanesToCheck` (adjacent tracks). If a parallel lane is clear within a localized `1500px` radius, the train mathematically initiates a cosine-interpolated crossover to bypass the hazard.
4. **Absolute Collision Shield**: If a block is dropped directly on a train, or two trains overlap, an absolute safety override forces `cur = 0` (instant halt) to prevent visual crashes.

## 6. Deep Dive: Twilio Dispatch Integration

When a critical block is scheduled via the UI or the AI Chatbot:
1. The frontend hits `/api/active_blocks` to save it to Postgres.
2. If successful, it triggers `/api/dispatch/notify`.
3. `dispatch.service.js` uses the Twilio Node SDK to create a dynamic TwiML response.
4. It blasts an SMS to registered engineer numbers: *"CRITICAL Block Alert: Engineering Dept has blocked Loop Line 1..."*.

## 7. Deep Dive: AI Dispatch Chatbot

1. Lives in a floating window in `maintenance/page.tsx`.
2. Uses **Groq** for ultra-fast LLM inference.
3. Injected with a system prompt containing the live telemetry of all trains (X-coordinates, speeds, lanes).
4. Provided with a `schedule_block` JSON tool.
5. If the user asks to schedule a block but misses details (e.g., Urgency or Date), the model asks follow-up questions.
6. Once satisfied, the model calls the tool, which fires the API request and instantly updates the live SVGs.
