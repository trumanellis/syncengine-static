# OrbitDB Desktop App Implementation Guide

*“Intention → Attention → Duration → Proof‑Token → Blessings → Value → Stewardship”*

---

## ✨ Overview

This guide describes a **desktop application** (Electron) that implements the Synchronicity Engine’s normalized data model and lifecycle using **OrbitDB** over **IPFS**. It is **append‑only where it matters**, **reference‑based** (no redundant facts), and **event‑sourced** for deterministic recomputation.

### Lifecycle (authoritative)

1. **Players define intentions.**
2. **Players direct attention** to an intention via **attention switch events**; an **attention duration** is the interval `[index, index+1)`.
3. **Posting a Proof of Service** *creates* a **Token of Gratitude** (unified record).
4. **All invested members** (anyone who has **ever** focused on that intention) are **notified**.
5. Members may **donate** one or more of their **closed attention durations** to the Proof‑Token, assigning **polarity** (`+1`or `‑1`).
6. The Proof‑Token maintains an **append‑only blessings list** whose entries **reference** the original attention durations: `{ giverId, attentionIndex, polarity }`.
7. **Token value** is computed: sum of durations; and **polarity‑weighted value** (support ‑ challenge).
8. **Stewardship** is set to the **service provider** by default.
9. Stewardship can be **traded** for Gifts / Asks / Tasks / Offerings.

---

## 🏗 Architecture

### Processes & Boundaries (Electron)

- **Main process**: window lifecycle, file system paths, native menus, secure IPC routing.
- **Background “DB Window” (hidden, BrowserWindow)**: runs **ipfs‑core** + **OrbitDB** (browser environment); hosts all databases and pubsub topics.
- **Renderer (UI)**: React/Vue/Svelte (your choice). Uses **preload** script to call typed IPC methods, avoiding direct DB access in the renderer.

```
Renderer (UI) ⇄ Preload (IPC bridge) ⇄ Main ⇄ Background DB Window (IPFS + OrbitDB)

```

### Data Plane

- **IPFS (browser node)** in the background window for connectivity + pubsub.
- **OrbitDB** instances and stores opened **only** in the DB window.
- **Typed IPC** methods expose DB operations to the renderer, preserving process isolation and a clean API.

---

## 📦 Directory Structure (suggested)

```
app/
  electron/
    main.ts            # Electron app bootstrap
    preload.ts         # Secure IPC bridge
    db-window.html     # Hidden window shell
    db-window.ts       # IPFS+OrbitDB bootstrap, open stores, handlers
    ipc-contract.ts    # Type definitions for IPC requests/responses
  domain/
    model.ts           # TypeScript interfaces (primitives, derived)
    stores.ts          # OrbitDB store openers + access controllers
    queries.ts         # Pure functions (derived computations)
    services/
      attention.ts     # switchAttention, read/write logs
      proofToken.ts    # postProofOfService, donateDuration, transfer
      notifications.ts # announcements, subscription helpers
      indexes.ts       # invested‑members, released‑duration indexers
  ui/
    index.html
    app.tsx
  package.json

```

---

## 🧬 Data Model (normalized, minimal facts)

> Normalization Axiom — Facts live in primitives. Derived records hold references, or optional computedcaches.
> 

### 🔹 Primitives

```tsx
export interface AttentionSwitchEvent {
  index: number;               // 0..N in user's attention log
  userId: string;              // who switched
  intentionId: string;         // intention after this switch
  timestamp: number;           // when switch occurred
  geo?: [number, number];
}

export interface Intention {
  intentionId: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: number;
  status: 'active' | 'completed';
}

// Unified Proof‑Token: posting a proof creates a token
export interface TokenOfGratitude {
  tokenId: string;             // id of the proof‑token
  intentionId: string;         // intention served
  submittedBy: string;         // service provider (initial steward)
  title: string;
  description: string;
  media: string[];             // IPFS refs
  timestamp: number;           // when proof posted
  geo?: [number, number];

  // Append‑only blessings (references to attention durations)
  blessings: Array<{
    giverId: string;
    attentionIndex: number;    // points to giver's AttentionSwitchEvent[index]
    polarity: 1 | -1;
  }>;

  // Custody
  steward: string;             // current holder (initially submittedBy)
  parent: string;              // previous holder (userId | tokenId)

  // Optional computed cache (non‑authoritative)
  computed?: {
    totalDurationMs?: number;
    totalValueMs?: number;     // polarity‑weighted
    supporters?: number;
    challengers?: number;
  };
}

// Global guard against double‑spend of durations
export interface ReleasedDuration {
  key: string;                 // `${giverId}#${attentionIndex}`
  tokenId: string;             // owning token
  releasedAt: number;
}

```

### 🔸 Derived Helpers (pure functions)

```tsx
export function durationMs(events: AttentionSwitchEvent[], index: number): number {
  const curr = events[index];
  if (!curr) throw new Error(`No event at index ${index}`);
  const next = events[index + 1];
  return (next?.timestamp ?? Date.now()) - curr.timestamp;
}

```

---

## 🗃 OrbitDB Stores

> Use eventlogs where append‑only is crucial; use docstores/keyvalue for registries.
> 
- **Attention Logs** (per‑user, eventlog): `attention.<userId>`
    - entries: `AttentionSwitchEvent`
    - **Access**: single‑writer (identity == userId)
- **Intentions** (docstore): `intentions`
    - key: `intentionId`
    - **Access**: multiwriter (anyone can propose by default, or restrict to known peers)
- **Tokens (Proof‑Tokens)** (docstore): `tokens`
    - key: `tokenId`
    - **Access**: multiwriter: creator + network (or gated by policy)
- **Blessings per Token** (eventlog): `token.<tokenId>.blessings`
    - entries: `{ giverId, attentionIndex, polarity }`
    - **Access**: multiwriter (any giver may append). The **ReleasedDuration guard** ensures validity.
    - The **unified token record** keeps `blessings` as an *aggregated view* of this log (rebuilt or cached to `computed`).
- **ReleasedDuration** (keyvalue): `released-durations`
    - key: `${giverId}#${attentionIndex}` → value: `tokenId`
    - **Access**: multiwriter; application enforces first‑write‑wins and rejects second writes for same key.
- **Invested Index** (keyvalue/docstore): `invested.<intentionId>`
    - value: set/list of `userId`s that have **ever** focused on the intention.
    - maintained by indexer subscribing to attention logs.
- **Announcements per Intention** (eventlog): `intention.<id>.announcements`
    - entries: `{ tokenId, timestamp, submittedBy }`
    - All investors subscribe; UI surfaces notifications locally.

> Note: Token’s append‑only blessings facet is implemented as its own eventlog for safe multiwriter concurrency, while the token doc remains the canonical metadata record. The UI exposes them as a single unified object.
> 

---

## 🔐 Access Control & Identity

- Create an **OrbitDB Identity** for the local user; persist keys in Electron’s app data directory.
- **Attention Logs**: single‑writer (only the owner identity can add events).
- **Tokens**: token creator writes metadata; **blessings eventlog** is multiwriter to allow donations.
- **ReleasedDuration**: multiwriter with **first‑writer wins** semantic enforced at app level.
- Consider encrypting **private** stores (e.g., attention logs) at rest with the user’s key.

---

## 🚀 Bootstrapping the DB Window

```tsx
// db-window.ts
import { create } from 'ipfs-core';
import OrbitDB from 'orbit-db';

export async function initDB() {
  const ipfs = await create({
    repo: 'synchronicity-ipfs',
    EXPERIMENTAL: { pubsub: true },
  });

  const orbitdb = await OrbitDB.createInstance(ipfs, { directory: 'synchronicity-orbitdb' });

  // open stores
  const stores = await openStores(orbitdb);

  // expose handlers to main via contextBridge or custom IPC
  bindIpcHandlers(stores);
}

```

```tsx
// stores.ts
export async function openStores(orbitdb: any) {
  const intentions = await orbitdb.docs('intentions', { indexBy: 'intentionId' });
  const tokens = await orbitdb.docs('tokens', { indexBy: 'tokenId' });
  const released = await orbitdb.kvstore('released-durations');
  const investedIndex = await orbitdb.kvstore('invested-index');
  return { intentions, tokens, released, investedIndex };
}

export async function openAttentionLog(orbitdb: any, userId: string) {
  return orbitdb.eventlog(`attention.${userId}`);
}

export async function openTokenBlessings(orbitdb: any, tokenId: string) {
  return orbitdb.eventlog(`token.${tokenId}.blessings`);
}

```

---

## 🔁 IPC Contract (typed)

```tsx
// ipc-contract.ts
export type IPC = {
  attention: {
    switchAttention: (userId: string, intentionId: string) => Promise<void>;
    getLog: (userId: string) => Promise<AttentionSwitchEvent[]>;
  };
  intentions: {
    create: (i: Intention) => Promise<void>;
    get: (id: string) => Promise<Intention | undefined>;
  };
  tokens: {
    postProof: (args: { intentionId: string; submittedBy: string; title: string; description: string; media: string[] }) => Promise<string>; // returns tokenId
    get: (tokenId: string) => Promise<TokenOfGratitude | undefined>;
    donate: (args: { tokenId: string; giverId: string; attentionIndex: number; polarity: 1 | -1 }) => Promise<void>;
    transfer: (args: { tokenId: string; recipientId: string }) => Promise<void>;
    refreshComputed: (tokenId: string) => Promise<void>;
  };
  announcements: {
    subscribe: (intentionId: string) => Promise<void>;
  };
};

```

---

## 📚 Services (core flows)

### 1) Attention: Switch & Index

```tsx
// attention.ts
export async function switchAttention(userId: string, intentionId: string) {
  const log = await openAttentionLog(orbitdb, userId);
  const index = (await log.all()).length;
  await log.add({ index, userId, intentionId, timestamp: Date.now() });

  // Update invested index (has EVER focused)
  const current = (await investedIndex.get(intentionId)) || new Set<string>();
  if (!current.has(userId)) {
    current.add(userId);
    await investedIndex.put(intentionId, Array.from(current));
  }
}

```

### 2) Proof‑Token: Post & Announce

```tsx
// proofToken.ts
export async function postProofOfService({ intentionId, submittedBy, title, description, media }: {
  intentionId: string; submittedBy: string; title: string; description: string; media: string[];
}) {
  const tokenId = randomId();
  const token: TokenOfGratitude = {
    tokenId, intentionId, submittedBy, title, description, media,
    timestamp: Date.now(), blessings: [], steward: submittedBy, parent: submittedBy,
  };
  await tokens.put(tokenId, token);

  // Announce
  const ann = await orbitdb.eventlog(`intention.${intentionId}.announcements`);
  await ann.add({ tokenId, intentionId, submittedBy, timestamp: token.timestamp });
  return tokenId;
}

```

### 3) Donate Duration (Blessing)

```tsx
export async function donateAttentionDuration({ tokenId, giverId, attentionIndex, polarity }: {
  tokenId: string; giverId: string; attentionIndex: number; polarity: 1 | -1;
}) {
  const token = await tokens.get(tokenId);
  if (!token) throw new Error('Unknown token');

  // Validate closed duration & intention match
  const log = await openAttentionLog(orbitdb, giverId);
  const events = (await log.all()).map(e => e.payload.value as AttentionSwitchEvent);
  const evt = events[attentionIndex];
  const next = events[attentionIndex + 1];
  if (!evt || !next) throw new Error('Duration must exist and be closed');
  if (evt.intentionId !== token.intentionId) throw new Error('Duration does not target this intention');

  // Double‑spend guard
  const key = `${giverId}#${attentionIndex}`;
  if (await released.get(key)) throw new Error('Duration already released');

  // Append blessing to per‑token eventlog
  const blessLog = await openTokenBlessings(orbitdb, tokenId);
  await blessLog.add({ giverId, attentionIndex, polarity });

  // Persist guard
  await released.put(key, tokenId);

  // Optional: refresh computed cache on token
  await refreshComputed(tokenId);
}

```

### 4) Refresh Computed Cache

```tsx
export async function refreshComputed(tokenId: string) {
  const token = await tokens.get(tokenId) as TokenOfGratitude;
  const blessLog = await openTokenBlessings(orbitdb, tokenId);
  const blessings = (await blessLog.all()).map(e => e.payload.value as TokenOfGratitude['blessings'][number]);

  let totalDurationMs = 0;
  let totalValueMs = 0;
  let supporters = 0;
  let challengers = 0;

  // Group events by giver for efficient duration lookup
  const logsCache = new Map<string, AttentionSwitchEvent[]>();
  async function getLog(giverId: string) {
    if (!logsCache.has(giverId)) {
      const log = await openAttentionLog(orbitdb, giverId);
      const evts = (await log.all()).map(e => e.payload.value as AttentionSwitchEvent);
      logsCache.set(giverId, evts);
    }
    return logsCache.get(giverId)!;
  }

  for (const b of blessings) {
    const evts = await getLog(b.giverId);
    const ms = durationMs(evts, b.attentionIndex);
    totalDurationMs += ms;
    totalValueMs += b.polarity * ms;
    if (b.polarity === 1) supporters++; else challengers++;
  }

  token.computed = { totalDurationMs, totalValueMs, supporters, challengers };
  await tokens.put(tokenId, token);
}

```

### 5) Transfer Stewardship

```tsx
export async function transferStewardship(tokenId: string, recipientId: string) {
  const token = await tokens.get(tokenId) as TokenOfGratitude;
  token.parent = token.steward;
  token.steward = recipientId;
  await tokens.put(tokenId, token);
}

```

---

## 🔔 Notifications Strategy

- **Announcements feed per intention**: `intention.<id>.announcements` (eventlog). All invested members **subscribe** and react locally (desktop notifications, UI toasts).
- **Why not write into user inboxes?** In OrbitDB, per‑user inboxes are typically single‑writer. Using an **intention channel** avoids cross‑identity writes.

---

## 🧪 Testing & Determinism

- **Deterministic recomputation**: from attention logs + blessings logs, you can always rebuild `computed` fields.
- **Property tests**:
    - Each `${giverId}#${attentionIndex}` appears **at most once** in `released-durations`.
    - All blessings on a token reference durations whose `evt.intentionId` matches the token’s `intentionId`.
    - Rebuilding `computed` after any replication round yields the same totals.

---

## 📦 Packaging & Dev

- Use **electron‑builder** or **Electron Forge**.
- Keep **OrbitDB/IPFS repos** under Electron’s `app.getPath('userData')` for per‑user persistence.
- Provide a **reset** command for dev (clears repos).

**Scripts (example):**

```json
{
  "scripts": {
    "dev": "vite-electron --open",
    "build": "electron-builder",
    "reset": "rimraf ~/.config/SynchronicityEngine/{synchronicity-ipfs,synchronicity-orbitdb}"
  }
}

```

---

## 🛡 Security Notes

- Consider **encrypting** attention logs at rest (user’s identity key).
- Consider **redacting** geo or make it opt‑in per event.
- UI should **preview** duration(s) and prompt before releasing, showing **polarity** impact.

---

## 📖 Developer Playbook (end‑to‑end)

1. **Create intention** → write to `intentions` docstore.
2. **Switch attention** → append to `attention.<userId>`; index user into `invested-index[intentionId]`.
3. **Post proof** → create token in `tokens`; announce to `intention.<id>.announcements`.
4. **Donate duration** → validate; append to `token.<tokenId>.blessings`; mark `released-durations`.
5. **Refresh computed** → recalc totals; update token doc.
6. **Transfer stewardship** → update token custody.

Everything else is UI. **The truth lives in the logs.** 💫

---

## ✅ Checklist (MVP Ready)

- [ ]  Electron app compiles; DB window boots IPFS+OrbitDB.
- [ ]  Stores open with correct access policies.
- [ ]  Attention switch logging + invested indexer.
- [ ]  Post Proof‑Token + announcement channel.
- [ ]  Donate duration with ReleasedDuration guard.
- [ ]  Recompute token computed fields on demand.
- [ ]  Transfer stewardship workflow.
- [ ]  Basic UI panes for Intentions / Attention / Tokens / Announcements.

> When in doubt, don’t store it — derive it.
>