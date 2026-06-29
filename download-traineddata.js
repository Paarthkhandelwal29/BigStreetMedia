import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

async function main() {
  const tessdataDir = path.join(process.cwd(), "lib", "cms", "inventory-batch", "tessdata");
  await mkdir(tessdataDir, { recursive: true });

  const url = "https://tessdata.projectnaptha.com/4.0.0_fast/eng.traineddata.gz";
  console.log("Downloading eng.traineddata.gz from:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const dest = path.join(tessdataDir, "eng.traineddata.gz");
    await writeFile(dest, buffer);
    console.log(`Successfully downloaded eng.traineddata.gz to ${dest} (${buffer.length} bytes)`);
  } catch (error) {
    console.error("Download failed:", error);
    process.exit(1);
  }
}

main();
