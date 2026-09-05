const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};

// Print the existing cover elements; no screenshot, clone, or replacement page.
export function createPagePrintSurface(scene: HTMLElement, controls: HTMLElement) {
  const page = scene.querySelector<HTMLElement>(".cover-page");
  if (!page) return null;
  const elements = [...page.children].filter((child): child is HTMLElement => child instanceof HTMLElement);
  let progress = 0;
  let height = 0;
  let top = 0;
  let regions: { element: HTMLElement; top: number; height: number }[] = [];

  const paint = (next: number) => {
    progress = next;
    const reveal = height * smooth(next / .76);
    const settle = smooth((next - .64) / .3);
    const registration = Math.sin(Math.PI * clamp(next / .94)) * (1 - settle);

    regions.forEach((region) => {
      const printed = clamp((reveal - region.top) / Math.max(1, region.height));
      region.element.style.setProperty("--print-cut", `${(1 - printed) * 100}%`);
    });
    page.style.setProperty("--print-registration", `${registration * 1.6}px`);
    page.style.setProperty("--print-sepia", String((1 - settle) * .65));
    page.style.setProperty("--print-grayscale", String(1 - settle));
    page.style.setProperty("--print-hue", `${(1 - settle) * 135}deg`);
    page.dataset.inkComplete = String(next >= .94);
    controls.style.setProperty("--print-scan-y", `${top + reveal}px`);
    controls.style.setProperty("--print-scan-opacity", String(next > 0 && next < .76 ? .45 : 0));
    controls.style.setProperty("--print-grain-opacity", String((1 - settle) * .16));
  };

  const measure = () => {
    const bounds = page.getBoundingClientRect();
    height = bounds.height;
    top = bounds.top;
    regions = elements.map((element) => {
      const region = element.getBoundingClientRect();
      return { element, top: region.top - bounds.top, height: region.height };
    });
    paint(progress);
  };
  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(page);

  return {
    paint,
    dispose() {
      observer.disconnect();
      elements.forEach((element) => element.style.removeProperty("--print-cut"));
      ["--print-registration", "--print-sepia", "--print-grayscale", "--print-hue"].forEach((name) => page.style.removeProperty(name));
      delete page.dataset.inkComplete;
    },
  };
}
