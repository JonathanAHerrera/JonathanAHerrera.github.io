import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SCREENSHOT_SOURCES_DIRECTORY = path.resolve("screenshot-sources");
const PUBLISHED_SCREENSHOTS_DIRECTORY = path.resolve("public/work");
// Twice the widest the gallery ever shows one figure (about 800 CSS px), so it stays sharp on 2x screens.
const PUBLISHED_WIDTH_PX = 1600;
const WEBP_QUALITY = 82;
const SOURCE_IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const workPieceIds = (await readdir(SCREENSHOT_SOURCES_DIRECTORY, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

for (const workPieceId of workPieceIds) {
  const sourceDirectory = path.join(SCREENSHOT_SOURCES_DIRECTORY, workPieceId);
  const outputDirectory = path.join(PUBLISHED_SCREENSHOTS_DIRECTORY, workPieceId);
  await mkdir(outputDirectory, { recursive: true });
  const sourceFileNames = (await readdir(sourceDirectory)).filter((fileName) =>
    SOURCE_IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()),
  );
  for (const sourceFileName of sourceFileNames) {
    const outputFileName = `${path.parse(sourceFileName).name}.webp`;
    const outputInformation = await sharp(path.join(sourceDirectory, sourceFileName))
      .resize({ width: PUBLISHED_WIDTH_PX, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(path.join(outputDirectory, outputFileName));
    console.log(
      `imageSrc: "/work/${workPieceId}/${outputFileName}", widthPx: ${outputInformation.width}, heightPx: ${outputInformation.height}  (${Math.round(outputInformation.size / 1024)} KB)`,
    );
  }
}
