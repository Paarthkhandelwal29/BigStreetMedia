import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export async function uploadFile(buffer: Buffer, fileName: string) {
  if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
    throw new Error("ImageKit environment variables are not configured.");
  }

  const response = await imagekit.upload({
    file: buffer,
    fileName,
    useUniqueFileName: true,
    folder: "/bigstreetmedia",
  });

  return response.url;
}

export function getImageKitUrl(path: string) {
  return path;
}
