const WIDTH = 640;
const HEIGHT = 800;
const PAPER = "#faf5e8";
const COLORS = ["#00a6cc", "#e83d79", "#ebce16", "#242822"];

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};

function makeCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  return canvas;
}

function createArtwork(photo?: HTMLImageElement) {
  const artwork = makeCanvas();
  const context = artwork.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.fillStyle = "#fff";
  context.fillRect(0, 0, WIDTH, HEIGHT);
  const text = (value: string, y: number, size: number, options: {
    font?: string; weight?: number; color?: string; x?: number; align?: CanvasTextAlign;
  } = {}) => {
    context.font = `${options.weight ?? 400} ${size}px ${options.font ?? "Georgia"}`;
    context.textAlign = options.align ?? "center";
    context.fillStyle = options.color ?? "#292922";
    context.fillText(value, options.x ?? WIDTH / 2, y);
  };
  const rule = (y: number, width = 1) => {
    context.strokeStyle = "#44463b";
    context.lineWidth = width;
    context.beginPath(); context.moveTo(38, y); context.lineTo(602, y); context.stroke();
  };
  const korean = '"AppleMyungjo", "Noto Serif KR", serif';
  text("THE WEDDING EDITION", 43, 14, { font: "Arial" });
  text("Wedding News", 111, 65, { weight: 700 });
  rule(129, 3); rule(135);
  text("VOL. 01", 159, 13, { font: "Arial", x: 40, align: "left" });
  text("SATURDAY, OCTOBER 17, 2026", 159, 13, { font: "Arial" });
  text("SPECIAL", 159, 13, { font: "Arial", x: 600, align: "right" });
  rule(173);
  text("우리, 결혼합니다.", 250, 55, { font: korean, weight: 900 });
  text("한원영 · 이나경", 288, 22, { font: korean, color: "#545b49" });

  if (photo) {
    // Reuse the already decoded cover photo; the loader adds no image request.
    const x = 70, y = 320, width = 500, height = 270;
    const scale = Math.max(width / photo.naturalWidth, height / photo.naturalHeight);
    const sourceWidth = width / scale, sourceHeight = height / scale;
    const sourceX = (photo.naturalWidth - sourceWidth) / 2;
    const sourceY = (photo.naturalHeight - sourceHeight) * .53;
    context.drawImage(photo, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  } else {
    // Typography is available immediately, even before the first photo arrives.
    context.strokeStyle = "#929d70"; context.lineWidth = 1.6;
    context.beginPath(); context.ellipse(320, 451, 170, 122, 0, 0, Math.PI * 2); context.stroke();
    text("&", 505, 151, { color: "#a26749" });
    text("TOGETHER, ALWAYS", 550, 16, { color: "#677453" });
  }

  rule(614);
  text("2026. 10. 17.", 663, 38, { color: "#303529" });
  text("토요일 오후 2시", 701, 23, { font: korean, weight: 600, color: "#4d5940" });
  rule(731); rule(737, 2);
  text("A NEW CHAPTER BEGINS", 770, 14, { color: "#586447" });
  return { artwork, context };
}

export function createPrintRenderer(canvas: HTMLCanvasElement, photo?: HTMLImageElement) {
  const context = canvas.getContext("2d");
  const source = createArtwork(photo);
  if (!context || !source) return null;
  const pixels = source.context.getImageData(0, 0, WIDTH, HEIGHT).data;
  const plates = COLORS.map(makeCanvas);
  const contexts = plates.map((plate, index) => {
    const ink = plate.getContext("2d");
    if (ink) ink.fillStyle = COLORS[index];
    return ink;
  });
  if (contexts.some((ink) => !ink)) return null;

  // Separate and rasterize each ink once. Animation only composites four cached plates.
  const step = 4;
  for (let y = 1; y < HEIGHT; y += step) {
    for (let x = 1; x < WIDTH; x += step) {
      const at = (y * WIDTH + x) * 4;
      const red = pixels[at] / 255, green = pixels[at + 1] / 255, blue = pixels[at + 2] / 255;
      const black = Math.min(1 - red, 1 - green, 1 - blue) * .65;
      const amounts = [(1 - red - black) / (1 - black), (1 - green - black) / (1 - black), (1 - blue - black) / (1 - black), black];
      contexts.forEach((ink, index) => {
        if (!ink || amounts[index] <= .015) return;
        ink.beginPath(); ink.arc(x, y, Math.sqrt(amounts[index]) * step * .68, 0, Math.PI * 2); ink.fill();
      });
    }
  }

  return (progress: number) => {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    context.fillStyle = PAPER; context.fillRect(0, 0, WIDTH, HEIGHT);
    const starts = [.015, .18, .34, .49];
    const offsets = [[-12, 3], [12, -8], [3, 12], [0, 0]];
    const alignment = 1 - smooth((progress - .7) / .2);
    const crisp = smooth((progress - .86) / .09);
    context.globalCompositeOperation = "multiply";
    plates.forEach((plate, index) => {
      const pass = smooth((progress - starts[index]) / .26);
      if (pass <= 0) return;
      context.save(); context.beginPath(); context.rect(0, 0, WIDTH, HEIGHT * pass); context.clip();
      context.globalAlpha = 1 - crisp;
      context.drawImage(plate, offsets[index][0] * alignment, offsets[index][1] * alignment);
      context.restore();
    });
    if (crisp > 0) {
      context.globalAlpha = crisp; context.drawImage(source.artwork, 0, 0); context.globalAlpha = 1;
    }
    context.globalCompositeOperation = "source-over";
  };
}
