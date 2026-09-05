import assert from "node:assert/strict";
import test from "node:test";
import { preloadResources } from "../app/resource-preloader.ts";

test("all unique resources must finish; progress never counts an unfinished resource", async () => {
  let finishAudio;
  const audio = new Promise((resolve) => { finishAudio = resolve; });
  const loaded = [];
  const progress = [];
  let settled = false;
  const pending = preloadResources(["photo", "sound", "photo"], async (source) => {
    loaded.push(source);
    if (source === "sound") await audio;
  }, (done, total) => progress.push([done, total]), new AbortController().signal)
    .then((failed) => { settled = true; return failed; });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(settled, false);
  assert.deepEqual(progress, [[1, 2]]);
  finishAudio();
  assert.deepEqual(await pending, []);
  assert.deepEqual(loaded, ["photo", "sound"]);
  assert.deepEqual(progress, [[1, 2], [2, 2]]);
});

test("retries only failed resources and reports permanent failures", async () => {
  const calls = new Map();
  const progress = [];
  const failed = await preloadResources(["photo", "flaky", "broken"], async (source) => {
    calls.set(source, (calls.get(source) || 0) + 1);
    if (source === "broken" || (source === "flaky" && calls.get(source) === 1)) throw Error("offline");
  }, (done) => progress.push(done), new AbortController().signal);
  assert.deepEqual(failed, ["broken"]);
  assert.equal(calls.get("photo"), 1);
  assert.equal(calls.get("flaky"), 2);
  assert.equal(calls.get("broken"), 2);
  assert.deepEqual(progress, [1, 2]);
});

test("an abandoned attempt cannot mark resources complete", async () => {
  const controller = new AbortController();
  let complete;
  const resource = new Promise((resolve) => { complete = resolve; });
  const progress = [];
  const pending = preloadResources(["sound"], () => resource, (done) => progress.push(done), controller.signal);
  controller.abort();
  complete();
  await assert.rejects(pending, { name: "AbortError" });
  assert.deepEqual(progress, []);
});
