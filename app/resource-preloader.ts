export async function preloadResources(
  sources: readonly string[],
  load: (source: string) => Promise<void>,
  onProgress: (complete: number, total: number) => void,
  signal: AbortSignal,
) {
  const unique = [...new Set(sources)];
  let complete = 0;
  const results = await Promise.allSettled(unique.map(async (source) => {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      signal.throwIfAborted();
      try {
        await load(source);
        signal.throwIfAborted();
        onProgress(++complete, unique.length);
        return;
      } catch (error) {
        signal.throwIfAborted();
        if (attempt === 1) throw error;
      }
    }
  }));
  signal.throwIfAborted();
  return results.flatMap((result, index) => result.status === "rejected" ? [unique[index]] : []);
}
