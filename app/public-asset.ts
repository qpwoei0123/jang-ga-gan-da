/** Keep public media under the deployment subdirectory on GitHub Pages. */
export function publicAsset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}
