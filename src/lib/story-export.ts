// Instagram Story Export - generates 1080x1920 canvas image

export interface StoryData {
  brandName: string;
  score: number;
  availableCount: number;
  takenCount: number;
}

export function generateStoryImage(data: StoryData): void {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Gradient background (dark purple to blue)
  const grad = ctx.createLinearGradient(0, 0, 0, 1920);
  grad.addColorStop(0, "#1e1040");
  grad.addColorStop(0.5, "#1a1060");
  grad.addColorStop(1, "#0a2060");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Decorative circles
  ctx.globalAlpha = 0.08;
  ctx.beginPath(); ctx.arc(200, 400, 300, 0, Math.PI * 2); ctx.fillStyle = "#8b5cf6"; ctx.fill();
  ctx.beginPath(); ctx.arc(880, 1400, 250, 0, Math.PI * 2); ctx.fillStyle = "#3b82f6"; ctx.fill();
  ctx.globalAlpha = 1;

  // Brand name
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 80px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(data.brandName, 540, 600);

  // Score circle
  const cx = 540, cy = 950, r = 140;
  ctx.beginPath(); ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 20; ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r + 10, -Math.PI / 2, -Math.PI / 2 + (data.score / 100) * Math.PI * 2);
  ctx.strokeStyle = data.score >= 70 ? "#22c55e" : data.score >= 40 ? "#eab308" : "#ef4444";
  ctx.lineWidth = 20; ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 100px Inter, sans-serif";
  ctx.fillText(`${data.score}`, cx, cy + 35);
  ctx.font = "24px Inter, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText("BRAND SCORE", cx, cy + 80);

  // Stats
  ctx.font = "bold 48px Inter, sans-serif";
  ctx.fillStyle = "#22c55e";
  ctx.fillText(`${data.availableCount} Available`, 540, 1300);
  ctx.fillStyle = "#ef4444";
  ctx.fillText(`${data.takenCount} Taken`, 540, 1380);

  // Branding
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "28px Inter, sans-serif";
  ctx.fillText("Checked with BrandScout.net", 540, 1800);

  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `brandscout-story-${data.brandName}.png`;
  a.click();
}
