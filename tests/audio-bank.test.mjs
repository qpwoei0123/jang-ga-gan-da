import assert from "node:assert/strict";
import test from "node:test";

test("autoplay suspension drops queued narration but preserves the first button cue", async (t) => {
  let unlock;
  const resumed = new Promise((resolve) => { unlock = resolve; });
  const started = [];
  const context = {
    state: "suspended", currentTime: 0, destination: {},
    decodeAudioData: async (bytes) => ({ bytes }),
    resume() { return resumed.then(() => { this.state = "running"; }); },
    createBufferSource() {
      return { buffer: null, connect() { return this; }, start() { started.push(this.buffer); }, disconnect() {} };
    },
    createGain() { return { gain: { value: 0 }, connect() { return this; }, disconnect() {} }; },
  };
  t.mock.method(globalThis, "fetch", async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(1) }));
  globalThis.window = { AudioContext: function () { return context; }, setTimeout, clearTimeout };
  t.after(() => { delete globalThis.window; });
  const audio = await import("../app/audio-bank.ts");
  await Promise.all([audio.preloadSound(audio.SANS_VOICE_SOUND), audio.preloadSound(audio.YES_TADA_SOUND)]);
  for (let index = 0; index < 12; index += 1) audio.playDecodedSound(audio.SANS_VOICE_SOUND);
  audio.playDecodedSound(audio.YES_TADA_SOUND);
  assert.equal(started.length, 0);
  unlock();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(started.length, 1);
});
