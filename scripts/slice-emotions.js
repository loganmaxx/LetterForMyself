const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgPath = 'C:/Users/Adrian/.gemini/antigravity/brain/f927d9ba-9388-4109-9060-1ccef51e9fd8/.user_uploaded/media_1792905724898_a97e9841.png';

const EMOTION_GRID = [
  ['happy', 'sad', 'calm', 'love', 'cry', 'excited'],
  ['surprised', 'grateful', 'content', 'neutral', 'bored', 'sleepy'],
  ['anxious', 'shocked', 'safe', 'lonely', 'angry', 'hopeful'],
  ['stressed', 'energetic', 'relaxed', 'motivation', 'upset', 'playful'],
  ['confident', 'overwhelmed', 'frustrated', 'peaceful', 'curious', 'confused'],
];

const COL_RANGES = [
  [30, 185],
  [195, 348],
  [355, 510],
  [510, 675],
  [678, 840],
  [840, 1000]
];

const ROW_RANGES = [
  [15, 152],
  [152, 286],
  [286, 416],
  [416, 542],
  [542, 666]
];

async function main() {
  const image = sharp(imgPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 6; c++) {
      const name = EMOTION_GRID[r][c];
      const [x1, x2] = COL_RANGES[c];
      const [y1, y2] = ROW_RANGES[r];

      // Scan rows from bottom up to find where the label ends and character begins
      const rowCounts = [];
      for (let y = y1; y < y2; y++) {
        let count = 0;
        for (let x = x1; x < x2; x++) {
          const idx = (y * info.width + x) * 4;
          if (data[idx + 3] > 20) count++;
        }
        rowCounts.push({ y, count });
      }

      // The label is at the bottom. Let's find the bottom of the cell where pixels exist
      // and look upwards for the gap/dip between text label and character
      let bottomPixelY = y2 - 1;
      while (bottomPixelY >= y1 && rowCounts[bottomPixelY - y1].count === 0) {
        bottomPixelY--;
      }

      // In the bottom ~25 pixels of the content, there is the text label (height ~15-20px).
      // Let's find the minimum count between y = bottomPixelY - 24 and bottomPixelY - 12
      let minDipY = bottomPixelY - 16;
      let minCount = 999999;
      for (let y = bottomPixelY - 26; y <= bottomPixelY - 10; y++) {
        if (y >= y1 && y < y2) {
          const c = rowCounts[y - y1].count;
          if (c < minCount) {
            minCount = c;
            minDipY = y;
          }
        }
      }

      console.log(`[${name}] bottom=${bottomPixelY}, dipAt=${minDipY} (count=${minCount})`);
    }
  }
}

main().catch(console.error);
