import ImageKit, { toFile } from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  timeout: 10000,
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

  const response = await imagekit.files.upload(
    {
      file: await toFile(buffer, fileName),
      fileName,
      useUniqueFileName: true,
      folder: "/bigstreetmedia",
    },
    {
      timeout: 10000,
      maxRetries: 0,
    },
  );

  console.log("[imagekit] upload:done", {
    fileName,
    url: response.url,
  });

  if (!response.url) {
    throw new Error("ImageKit upload did not return a URL.");
  }

  return response.url;
}

export function getImageKitUrl(path: string) {
  return path;
}
