import { createCanvas } from "canvas";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const canvas = createCanvas(1200, 630);
const ctx = canvas.getContext("2d");

// Draw background gradient (approximated with steps)
const bgColors = [
  { pos: 0, color: "#1a1a2e" },
  { pos: 0.5, color: "#16213e" },
  { pos: 1, color: "#0f3460" },
];

for (let i = 0; i < 1200; i++) {
  const ratio = i / 1200;
  let color;
  if (ratio <= 0.5) {
    const t = ratio * 2;
    color = interpolateColor("#1a1a2e", "#16213e", t);
  } else {
    const t = (ratio - 0.5) * 2;
    color = interpolateColor("#16213e", "#0f3460", t);
  }
  ctx.fillStyle = color;
  ctx.fillRect(i, 0, 1, 630);
}

function interpolateColor(color1, color2, t) {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Draw decorative lines
ctx.strokeStyle = "#646cff";
ctx.globalAlpha = 0.5;
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(0, 100);
ctx.lineTo(1200, 100);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(0, 530);
ctx.lineTo(1200, 530);
ctx.stroke();
ctx.globalAlpha = 1;

// Draw decorative corners
ctx.fillStyle = "#646cff";
ctx.globalAlpha = 0.8;

// Top-left
ctx.fillRect(50, 50, 80, 3);
ctx.fillRect(50, 50, 3, 80);

// Top-right
ctx.fillRect(1070, 50, 80, 3);
ctx.fillRect(1147, 50, 3, 80);

// Bottom-left
ctx.fillRect(50, 577, 80, 3);
ctx.fillRect(50, 500, 3, 80);

// Bottom-right
ctx.fillRect(1070, 577, 80, 3);
ctx.fillRect(1147, 500, 3, 80);

ctx.globalAlpha = 1;

// Draw emoji/icon
ctx.font = 'bold 80px Arial, "Segoe UI Emoji", sans-serif';
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillStyle = "#ffffff";
ctx.fillText("🎮", 600, 180);

// Draw main title
ctx.font = 'bold 72px Arial, "Hiragino Sans", "Yu Gothic", sans-serif';
ctx.fillStyle = "#ffffff";
ctx.fillText("基質厳選ツール", 600, 300);

// Draw subtitle
ctx.font = '36px Arial, "Hiragino Sans", "Yu Gothic", sans-serif';
ctx.fillStyle = "#a0a0ff";
ctx.fillText("アークナイツ：エンドフィールド", 600, 360);

// Draw separator line
ctx.strokeStyle = "#646cff";
ctx.globalAlpha = 0.6;
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(350, 400);
ctx.lineTo(850, 400);
ctx.stroke();
ctx.globalAlpha = 1;

// Draw description
ctx.font = '28px Arial, "Hiragino Sans", "Yu Gothic", sans-serif';
ctx.fillStyle = "#d0d0d0";
ctx.fillText("欲しい基質を選択すると、一緒に狙える基質を", 600, 460);
ctx.fillText("超域活性点ごとに全パターン表示", 600, 500);

// Save as PNG
const buffer = canvas.toBuffer("image/png");
const outputPath = join(__dirname, "../public/ogp.png");
writeFileSync(outputPath, buffer);
console.log("✅ OGP画像が生成されました:", outputPath);
