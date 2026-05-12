# AEGIS Phase 3 — Monitoring & Self-Healing (Fresh Build)

> Project workspace: `D:\refactory\AEGIS\phase3`
> Stack: Next.js 14.2 (App Router) · React 18 · TypeScript · Tailwind · Zustand · Recharts · Lucide
> Dev port: `5000` (web/ pakai 4000, aegis-teaser pakai 3000)

Phase 3 dari platform AEGIS adalah tahap **pemantauan & self-healing real-time**. Tujuan UI di sini adalah memberi *security operator* satu pane untuk:

1. Melihat traffic + alert live.
2. Memahami konteks setiap insiden.
3. Mempercayai (atau membatalkan) tindakan otomatis self-healing yang dilakukan AEGIS.

---

## 1. Arsitektur Folder

```
phase3/
├── PLAN.md                       <- dokumen ini
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── src/
    ├── app/
    │   ├── layout.tsx           <- root layout (theme + sidebar shell)
    │   ├── page.tsx             <- redirect ke /dashboard
    │   ├── globals.css
    │   ├── dashboard/page.tsx   <- ringkasan Phase 3
    │   ├── alerts/page.tsx      <- daftar + detail alert
    │   ├── healing/page.tsx     <- aksi self-healing (active/reversed/expired)
    │   ├── logs/page.tsx        <- log streaming
    │   ├── audit/page.tsx       <- audit trail aksi user & sistem
    │   └── settings/page.tsx    <- konfigurasi alert/healing rules
    ├── components/
    │   ├── shell/               <- Sidebar, Topbar, ThemeToggle
    │   ├── monitoring/          <- StatusBar, TrafficChart, ThreatFeed, AlertDetailDrawer
    │   ├── healing/             <- HealingActionsList, HealingDetail, ReverseConfirm
    │   ├── logs/                <- LogStream, LogFilters
    │   ├── audit/               <- AuditTable
    │   └── ui/                  <- primitives: button, card, badge, dialog, drawer, tabs
    ├── lib/
    │   ├── types.ts             <- AttackEvent, HealingAction, LogLine, AuditEntry, ...
    │   ├── cn.ts                <- tailwind merge util
    │   ├── format.ts            <- waktu, ip, dst.
    │   └── id.ts                <- nanoid wrapper
    ├── store/
    │   ├── monitoringStore.ts   <- traffic + alerts + stats
    │   ├── healingStore.ts      <- healing actions + snapshots + reverse deadlines
    │   ├── logStore.ts          <- ring buffer log streaming
    │   ├── auditStore.ts        <- audit trail HITL
    │   └── settingsStore.ts     <- konfigurasi rules
    └── engine/
        ├── eventBus.ts          <- pub/sub internal
        ├── simulator.ts         <- mock real-time generator (attacks, traffic, logs)
        ├── realtime.ts          <- abstraksi: simulator | SSE | WebSocket
        ├── healingEngine.ts     <- auto-patch policy, snapshot, reverse window
        └── policies.ts          <- rules: severity → action mapping
```

Pemisahan `store/` dari `engine/`: engine adalah *producer* event, store adalah *state container* yang konsumsi event lewat `eventBus`. Komponen UI hanya tahu store (tidak menyentuh engine langsung). Ini bikin gampang ganti `simulator` → backend asli nanti.

---

## 2. Roadmap Implementasi (5 Batch)

### Batch 1 — Foundation
- Theme dark (HSL token, sama dengan repo lain) + warna semantic: success/warning/destructive.
- Shell layout: sidebar (Dashboard / Alerts / Healing / Logs / Audit / Settings) + topbar (status pill + clock + theme toggle).
- Routing App Router untuk semua page (stub konten).
- UI primitives: `Card`, `Button`, `Badge`, `Tabs`, `Drawer`, `Dialog`, `Tooltip`.

### Batch 2 — Monitoring UI
- `StatusBar`: 4 kartu (system status, throughput, attacks blocked, snapshots aktif).
- `TrafficChart` (recharts): line chart normal vs malicious, dengan brush/zoom.
- `ThreatFeed`: list live attack dengan severity color, klik → `AlertDetailDrawer`.
- `AlertDetailDrawer`: payload, header, geo IP (mock), correlation ke healing action.

### Batch 3 — Real-time Engine
- `eventBus` tipe-aman (event: `attack`, `traffic-tick`, `log`, `healing`, `reverse`).
- `simulator`: tick 2s, generate traffic + attack + log line; spike Poisson-like.
- `realtime` adapter: default `simulator`, ada hook `useRealtimeSource()` agar mudah swap ke SSE/WS.
- `logs/page.tsx`: virtualized log stream + filter (severity, source, search), pause/resume, follow tail.

### Batch 4 — Self-Healing
- `healingEngine`: subscribe `attack` event. Jika severity ≥ High, jalankan policy → buat `HealingAction` (status `Applied`), simulasikan snapshot rollback record, set `reverseDeadline = now + 30m`.
- `healingStore`: list aksi + sorting + filter status.
- `healing/page.tsx`: tab Active / Reversed / Expired; tiap kartu punya tombol **Reverse** dengan `Dialog` konfirmasi (HITL).
- Audit trail: setiap aksi otomatis & manual → `auditStore` (siapa, kapan, alasan).
- `policies.ts`: mapping `attackType + severity → patchName + WAFRule`. User bisa ubah dari `settings/page.tsx` (rule editor sederhana).

### Batch 5 — Verifikasi
- `npm run lint` & `npm run typecheck` clean.
- `npm run build` sukses.
- `npm run dev` smoke test: dashboard render, traffic tick jalan, attack muncul, healing tercatat, reverse berfungsi, audit terisi.

---

## 3. Tipe Data Inti (preview)

```ts
type Severity = "Critical" | "High" | "Medium" | "Low";

interface AttackEvent {
  id: string;
  type: string;            // "SQL Injection", ...
  severity: Severity;
  sourceIp: string;
  geo?: { country: string; city?: string };
  targetEndpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  payloadSnippet: string;
  timestamp: number;       // epoch ms
  matchedRuleId?: string;
}

interface HealingAction {
  id: string;
  attackId: string;
  attackType: string;
  status: "Applied" | "Reversed" | "Expired";
  patch: string;           // "Auto-patch for SQL Injection"
  wafRuleId: string;
  snapshotId: string;
  appliedAt: number;
  reverseDeadline: number;
  reversedAt?: number;
  reversedBy?: string;
}

interface LogLine {
  id: string;
  ts: number;
  level: "info" | "warn" | "error" | "debug";
  source: string;          // "edge", "api", "engine", ...
  msg: string;
  attackId?: string;
}

interface AuditEntry {
  id: string;
  ts: number;
  actor: "system" | "operator";
  action: "apply-patch" | "reverse-patch" | "edit-rule" | "ack-alert";
  refId: string;           // healing id / rule id / attack id
  note?: string;
}
```

---

## 4. Prinsip Desain

- **Operator-first**: density tinggi, tapi tetap terbaca. Mono untuk angka & IP, sans untuk teks naratif.
- **Trust by default, override by intent**: aksi otomatis ditampilkan jelas + selalu reversible dalam jendela 30 menit.
- **Real-time without anxiety**: animasi halus, jangan flicker. Indikator status global tetap di topbar.
- **Mock = swappable**: semua data masuk lewat `realtime` adapter. Ganti simulator ke endpoint asli = ubah satu file.

---

## 5. Out of Scope (untuk iterasi ini)

- Auth (asumsi sudah lewat shell platform).
- Persistensi: state di memori; cukup untuk demo Phase 3 standalone.
- Multi-tenant.
- I18n.

Bisa ditambah di iterasi berikutnya tanpa rework arsitektur, karena `store/` dan `engine/` sudah terisolasi.
