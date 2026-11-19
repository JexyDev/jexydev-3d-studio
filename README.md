# JexyDev — Interactive 3D Autonomous Engineering Studio

> **Live Demo:** [https://jexydev-3d-studio.vercel.app](https://jexydev-3d-studio.vercel.app)

An interactive 3D visualization of Jeremy Darrell Andreas's (`JexyDev`) 24/7 Autonomous Engineering Pipeline, built with Vite + React 18 + TypeScript + Three.js (`@react-three/fiber`, `@react-three/drei`) + Tailwind CSS.

---

## Overview

The studio renders a dark-minimalist 3D office environment where autonomous engineering agents operate continuously. Visitors can:

- **Observe** the 5-agent autonomous pipeline (Hermes, Frontend, Backend, QA/QC, DevOps) in real time.
- **Click** on any agent workstation or the Hermes Core to inspect its current task, pipeline phase, tech stack, and completion count.
- **Navigate** the 3D scene freely via OrbitControls, or switch between preset camera angles.
- **Dispatch** a custom engineering task via the Manual Dispatch interface — Hermes routes it into the simulation.
- **Monitor** live telemetry logs in the collapsible Terminal console.
- **Browse** featured production systems (BERSEKA, Bitanic, Bogor Tolo) in the Projects Drawer.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build Tool | Vite 6 |
| UI Framework | React 18 + TypeScript (strict) |
| 3D Rendering | Three.js · @react-three/fiber · @react-three/drei |
| Styling | Tailwind CSS 3 |
| Language | TypeScript 5.6 (strict mode) |

---

## Directory Structure

```
src/
├── types/studio.ts           — Core TypeScript type definitions
├── data/
│   ├── agents.ts             — Agent roster definitions (static)
│   └── projects.ts           — Production system cards
├── engine/
│   ├── autonomousEngine.ts   — 24/7 simulation state machine
│   └── telemetryBridge.ts    — SSE bridge with silent fallback
├── scene/
│   ├── StudioCanvas.tsx      — Root Three.js Canvas assembler
│   ├── OfficeEnvironment.tsx — Floor, lighting, zone dividers
│   ├── HermesCore.tsx        — Central orchestrator node
│   ├── AgentWorkstation.tsx  — Individual agent desk + avatar
│   ├── DataPacketStream.tsx  — Animated spline packet trails
│   └── CameraRig.tsx         — OrbitControls + preset lerping
└── components/hud/
    ├── TopBar.tsx             — Main HUD bar
    ├── AgentInspector.tsx     — Slide-in agent detail panel
    ├── TelemetryTerminal.tsx  — Collapsible log console
    ├── TaskDispatchModal.tsx  — Visitor task injection modal
    └── ProjectsDrawer.tsx     — Portfolio systems drawer
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Type-check (TypeScript strict mode)
npm run typecheck

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| `VITE_SSE_URL` | Live SSE telemetry endpoint URL | No — falls back to built-in simulation silently |

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from jexydev-3d-studio/ directory
vercel --prod
```

Set the **Build Command** to `npm run build` and **Output Directory** to `dist`.

### GitHub Pages

```bash
npm run build
# Deploy the ./dist directory to GitHub Pages
```

---

## Author

**Jeremy Darrell Andreas** — `github.com/JexyDev`  
Bogor / Bandung, Indonesia · Asia/Jakarta (UTC+07:00)
