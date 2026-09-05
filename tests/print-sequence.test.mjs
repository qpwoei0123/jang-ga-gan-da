import assert from "node:assert/strict";
import test from "node:test";
import { createPrintSequence, getPrintTarget } from "../app/print-sequence.ts";

function fakeClock() {
  let now = 0;
  let id = 0;
  const frames = new Map();
  const timers = new Map();
  return {
    scheduler: {
      request(callback) { frames.set(++id, callback); return id; },
      cancel(key) { frames.delete(key); },
      delay(callback, duration) { timers.set(++id, { callback, due: now + duration }); return id; },
      clear(key) { timers.delete(key); },
    },
    advance(duration) {
      const end = now + duration;
      while (now < end) {
        now = Math.min(end, now + 16);
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach((callback) => callback(now));
        for (const [key, timer] of timers) {
          if (timer.due <= now) { timers.delete(key); timer.callback(); }
        }
      }
    },
    pending() { return frames.size + timers.size; },
  };
}

test("cached resources still print the ink passes before the delivery handoff", () => {
  const clock = fakeClock();
  let progress = 0;
  let handoffs = 0;
  const sequence = createPrintSequence({ scheduler: clock.scheduler, onProgress: (value) => { progress = value; }, onComplete: () => { handoffs++; } });
  sequence.setTarget(getPrintTarget(16, 16, true));
  clock.advance(1000);
  assert.ok(progress > .3 && progress < .6, "The cached path must visibly pass through CMYK instead of snapping to 100%.");
  assert.equal(handoffs, 0);
  clock.advance(1300);
  assert.equal(progress, 1);
  assert.equal(handoffs, 0, "The completed print must remain visible while its stamp appears.");
  clock.advance(400);
  assert.equal(handoffs, 1);
  sequence.setTarget(1);
  clock.advance(2000);
  assert.equal(handoffs, 1);
  assert.equal(clock.pending(), 0);
});

test("elapsed animation time cannot open an invitation with unfinished resources or layout", () => {
  const clock = fakeClock();
  let progress = 0;
  let handoffs = 0;
  const sequence = createPrintSequence({ scheduler: clock.scheduler, onProgress: (value) => { progress = value; }, onComplete: () => { handoffs++; } });
  sequence.setTarget(getPrintTarget(15, 16, false));
  clock.advance(10000);
  assert.ok(progress < 1);
  assert.equal(handoffs, 0);
  sequence.setTarget(getPrintTarget(16, 16, false));
  clock.advance(10000);
  assert.ok(progress < 1, "Real layout preparation still needs to finish.");
  assert.equal(handoffs, 0);
  sequence.setTarget(getPrintTarget(16, 16, true));
  clock.advance(200);
  assert.equal(progress, 1);
  assert.equal(handoffs, 0);
  clock.advance(400);
  assert.equal(handoffs, 1, "A slow load only needs the remaining ink and stamp, not another full replay.");
});

test("retrying or unmounting cancels both an active ink pass and a pending stamp handoff", () => {
  for (const elapsed of [500, 2300]) {
    const clock = fakeClock();
    let handoffs = 0;
    const sequence = createPrintSequence({ scheduler: clock.scheduler, onProgress() {}, onComplete: () => { handoffs++; } });
    sequence.setTarget(1);
    clock.advance(elapsed);
    sequence.dispose();
    clock.advance(5000);
    assert.equal(handoffs, 0);
    assert.equal(clock.pending(), 0);
  }
});

test("reduced motion still waits for all resources but can finish without the print animation", () => {
  const clock = fakeClock();
  let handoffs = 0;
  const sequence = createPrintSequence({ scheduler: clock.scheduler, reducedMotion: true, onProgress() {}, onComplete: () => { handoffs++; } });
  sequence.setTarget(getPrintTarget(16, 16, false));
  clock.advance(10000);
  assert.equal(handoffs, 0);
  sequence.setTarget(getPrintTarget(16, 16, true));
  clock.advance(16);
  assert.equal(handoffs, 1);
});
