# Proof of Concept Architecture

*"Minimum viable paradise through intention, attention, and gratitude"*

---

## Core Design Philosophy

The architecture follows a **normalized, lifecycle-driven model**:

- **Intentions** are the seeds of dreams.
- **Attention Switch Events** are the only primitive measure of focus and time.
- **Proof of Service and Token of Gratitude are unified** into a single structure representing both the deed and the circulating token.
- **Blessings** are just references to attention durations, permanently assigned to tokens when released.

No redundant data is stored. All derived values are recomputable from primitives.

---

## Lifecycle of Attention

1. **Players define intentions.**
2. **Players direct attention** — each switch event logs focus on an intention.
3. **Service anchors the dream** — when a Proof of Service is posted, it is simultaneously a Token of Gratitude.
4. **Peers are notified** of the new token/proof.
5. **Invested members release attention durations** — they choose polarity (+1 or –1) when donating.
6. **Blessings form** — each donation is an append-only reference to the giver’s attention switch index, with polarity recorded.
7. **Token value emerges** — recomputed from the weighted sum of donated durations and polarities.
8. **Custody is assigned** — the service provider becomes initial steward.
9. **Tokens circulate** — stewardship can be traded for gifts, asks, tasks, or offerings.

---

## Core Data Structures

> Normalization Axiom — Facts live in primitives. Everything else is a reference or a recomputation.
> 

### 🔹 Primitives (Authoritative Facts)

### 1) Attention Switch Event (per‑user append‑only)

```
interface AttentionSwitchEvent {
  index: number;                // natural index in a user's log
  userId: string;               // who switched
  intentionId: string;          // intention being focused *after* this event
  timestamp: number;            // when the switch occurred
  geo?: [number, number];       // optional (lat, lon)
}
```

- An **attention duration** is the interval `[index, index+1)`.
- The **intention for the duration** is `event[index].intentionId`.

### 2) Intention (registry)

```
interface Intention {
  intentionId: string;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: number;
  status: "active" | "completed";
}
```

### 3) Proof‑Token (Unified object)

> Posting a Proof of Service creates a Token of Gratitude — two facets of the same record.
> 

```
interface TokenOfGratitude {
  tokenId: string;                  // id of the proof‑token
  intentionId: string;              // intention served
  submittedBy: string;              // service provider (initial steward)
  title: string;
  description: string;
  media: string[];                  // IPFS refs
  timestamp: number;                // when the proof was posted
  geo?: [number, number];

  // Append‑only list of donated durations ("blessings")
  blessings: Array<{
    giverId: string;                // who donates the duration
    attentionIndex: number;         // points to giver's AttentionSwitchEvent[index]
    polarity: 1 | -1;               // assigned at donation time based on quality
  }>;

  // Custody
  steward: string;                  // current holder (initially submittedBy)
  parent: string;                   // previous holder (userId | tokenId)

  // Optional cached (recomputable) views for UX
  computed?: {
    totalDurationMs?: number;       // sum(durationMs for all blessings)
    totalValueMs?: number;          // sum(polarity * durationMs)
    supporters?: number;            // count where polarity == +1
    challengers?: number;           // count where polarity == -1
  };
}
```

### 4) Released Duration Index (global guard against double‑spend)

```
// Append‑only mapping: one donation per duration forever
interface ReleasedDuration {
  key: string;                      // `${giverId}#${attentionIndex}`
  tokenId: string;                  // the proof‑token that owns it now
  releasedAt: number;
}
```

- Once a duration is released to a token, it’s **permanently assigned**.

---

### 🔸 Derived/Views (No new facts)

- **Durations** are computed from adjacent events in the giver's log.
- **Invested members** for an intention at a given time are derived from active durations targeting that intention.

---

## Core Functions

### ⏱️ Duration from an Attention Index

```
function durationMs(userId: string, index: number): number {
  const log = getUserAttentionLog(userId);
  const curr = log.at(index);
  if (!curr) throw new Error(`No event at index ${index} for ${userId}`);
  const next = log.at(index + 1);
  const start = curr.timestamp;
  const end = next ? next.timestamp : Date.now();
  return end - start;
}
```

### 👥 Who is Invested in an Intention (Lifetime)

```
function getInvestedMembers(intentionId: string): string[] {
  // A member is "invested" if they have EVER pointed attention to this intention
  return allUsers().filter(uid => {
    const log = getUserAttentionLog(uid);
    return log.some(evt => evt.intentionId === intentionId);
  });
}
```ts
function getInvestedMembers(intentionId: string, at: number): string[] {
  // A member is "invested" if their current active duration at time `at`
  // targets `intentionId`.
  return allUsers().filter(uid => {
    const log = getUserAttentionLog(uid);
    if (log.length === 0) return false;
    // find last event at or before `at`
    const i = lastIndexAtOrBefore(log, at);
    if (i < 0) return false;
    const evt = log[i];
    const next = log[i + 1];
    const open = !next || next.timestamp > at; // active at `at`
    return open && evt.intentionId === intentionId;
  });
}
```

### 🔔 Post Proof of Service ⇒ Create Proof‑Token + Notify

```
async function postProofOfService(intentionId: string, submittedBy: string, title: string, description: string, media: string[]) {
  const tokenId = generateId();
  const timestamp = Date.now();

  const token: TokenOfGratitude = {
    tokenId,
    intentionId,
    submittedBy,
    title,
    description,
    media,
    timestamp,
    blessings: [],
    steward: submittedBy,
    parent: submittedBy,
  };

  await tokensDB.put(tokenId, token);

  // Notify those actively invested at proof time
  const invested = getInvestedMembers(intentionId, timestamp);
  await notify(invested, { type: "proof-posted", tokenId, intentionId });

  return tokenId;
}
```

### 🎁 Donate an Attention Duration (Blessing)

```
async function donateAttentionDuration(giverId: string, tokenId: string, attentionIndex: number, polarity: 1 | -1) {
  const token = await tokensDB.get(tokenId);
  if (!token) throw new Error("Unknown token");

  // Ensure the duration exists and is CLOSED (has a next event)
  const log = getUserAttentionLog(giverId);
  const evt = log.at(attentionIndex);
  const nxt = log.at(attentionIndex + 1);
  if (!evt || !nxt) throw new Error("Attention duration must exist and be closed");

  // Ensure the duration targeted THIS intention
  if (evt.intentionId !== token.intentionId) throw new Error("Duration does not belong to this intention");

  // Enforce one‑time release (global guard)
  const key = `${giverId}#${attentionIndex}`;
  if (await releasedIndexExists(key)) throw new Error("This attention duration has already been released");

  // Append blessing (append‑only)
  token.blessings.push({ giverId, attentionIndex, polarity });
  await tokensDB.put(tokenId, token);

  // Register the release (append‑only)
  await releasedDB.add({ key, tokenId, releasedAt: Date.now() });

  // Optionally refresh cached computed fields
  await refreshTokenComputed(tokenId);
}
```

### ♻️ Refresh Computed Views (Optional Cache)

```
async function refreshTokenComputed(tokenId: string) {
  const token = await tokensDB.get(tokenId);
  if (!token) return;

  let totalMs = 0;
  let totalValue = 0;
  let supporters = 0;
  let challengers = 0;

  for (const b of token.blessings) {
    const ms = durationMs(b.giverId, b.attentionIndex);
    totalMs += ms;
    totalValue += b.polarity * ms;
    if (b.polarity === 1) supporters++; else challengers++;
  }

  token.computed = {
    totalDurationMs: totalMs,
    totalValueMs: totalValue,
    supporters,
    challengers,
  };

  await tokensDB.put(tokenId, token);
}
```

### 🔁 Transfer Stewardship (Gift/Ask/Task/Offering)

```
async function transferStewardship(tokenId: string, recipientId: string) {
  const token = await tokensDB.get(tokenId);
  token.parent = token.steward;
  token.steward = recipientId;
  await tokensDB.put(tokenId, token);
}
```

---

## Database Schema (OrbitDB/IPFS) (OrbitDB/IPFS)

- **Event Logs:** one per user (`attention-<userId>`)
- **Document Stores:**
    - `intentions`
    - `proofTokens` (unified proof + token)

---

## Stewardship Map

Each unified proof-token projects into the Earth as a **stewardship marker**:

- Location and timestamp light up the map.
- Donated blessings add charge and polarity.
- Stewardship domains emerge from accumulated proofs/tokens.

---

## Closing Note

This clarified architecture revolves around three primitives:

- **Intentions** (dreams)
- **Attention Switch Events** (focus logs)
- **ProofTokens** (anchored deeds + gratitude currency)

From these, the full sacred economy of **attention, proof, and gratitude** naturally unfolds.