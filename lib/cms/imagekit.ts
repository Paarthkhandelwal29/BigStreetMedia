import ImageKit, { toFile } from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  timeout: 120000,
  maxRetries: 0,
});

export async function uploadFile(buffer: Buffer, fileName: string) {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || "";
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || "";

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error("ImageKit environment variables are not configured.");
  }

  console.log("[imagekit] upload:start", {
    fileName,
    size: buffer.length,
    urlEndpoint,
    hasPublicKey: Boolean(publicKey),
    hasPrivateKey: Boolean(privateKey),
  });

  const timeout = buffer.length > 50 * 1024 * 1024 ? 180000 : 60000;

  const response = await imagekit.files.upload(
    {
      file: await toFile(buffer, fileName),
      fileName,
      useUniqueFileName: true,
      folder: "/bigstreetmedia",
    },
    {
      timeout,
      maxRetries: 0,
    },
  );

  const url = response.url;
  if (!url) {
    throw new Error(`ImageKit did not return a URL for ${fileName}.`);
  }

  console.log("[imagekit] upload:done", {
    fileName,
    url,
  });

  return url;
}

export function getImageKitUrl(path: string) {
  return path;
}
