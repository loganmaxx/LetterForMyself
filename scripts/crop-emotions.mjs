import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

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

async function cropAll() {
  const masterImage = sharp(imgPath);
  const { data, info } = await masterImage.raw().toBuffer({ resolveWithObject: true });

  const cleanDir = path.resolve('public/emotions');
  const labeledDir = path.resolve('public/emotions/with-label');

  if (!fs.existsSync(cleanDir)) fs.mkdirSync(cleanDir, { recursive: true });
  if (!fs.existsSync(labeledDir)) fs.mkdirSync(labeledDir, { recursive: true });

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 6; c++) {
      const name = EMOTION_GRID[r][c];
      const [x1, x2] = COL_RANGES[c];
      const [y1, y2] = ROW_RANGES[r];

      // 1. Detect text label top
      let textTopY = null;
      for (let y = y2 - 25; y < y2; y++) {
        let hasBlack = false;
        for (let x = x1; x < x2; x++) {
          const idx = (y * info.width + x) * 4;
          if (data[idx + 3] > 200) {
            const red = data[idx], green = data[idx + 1], blue = data[idx + 2];
            if (red < 50 && green < 50 && blue < 50) {
              hasBlack = true;
              break;
            }
          }
        }
        if (hasBlack) {
          textTopY = y;
          break;
        }
      }

      const cutY = textTopY ? textTopY - 4 : y2 - 25;

      // Extract Clean Character (First extract, THEN trim in separate step)
      const cleanWidth = x2 - x1;
      const cleanHeight = cutY - y1;

      const rawClean = await sharp(imgPath)
        .extract({ left: x1, top: y1, width: cleanWidth, height: cleanHeight })
        .png()
        .toBuffer();

      const trimmedClean = await sharp(rawClean)
        .trim({ threshold: 5 })
        .extend({
          top: 6,
          bottom: 6,
          left: 6,
          right: 6,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(path.join(cleanDir, `${name}.png`));

      // Extract Labeled Character
      const fullWidth = x2 - x1;
      const fullHeight = y2 - y1;

      const rawFull = await sharp(imgPath)
        .extract({ left: x1, top: y1, width: fullWidth, height: fullHeight })
        .png()
        .toBuffer();

      await sharp(rawFull)
        .trim({ threshold: 5 })
        .extend({
          top: 4,
          bottom: 4,
          left: 4,
          right: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(path.join(labeledDir, `${name}.png`));

      console.log(`Saved [${r},${c}]: ${name}.png (clean & with-label)`);
    }
  }

  console.log('\nAll 30 emotion stickers cropped successfully!');
}

cropAll().catch(console.error);
