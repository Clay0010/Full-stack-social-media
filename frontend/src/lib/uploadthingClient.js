import { generateUploadThingUrl } from "uploadthing/client";

const uploadFile = async (file) => {
  const { url, fileKey } = await generateUploadThingUrl({
    files: [file],
    endpoint: "imageUploader",
    config: {
      publicKey: import.meta.env.VITE_UPLOADTHING_TOKEN, // from dashboard
      maxFileCount: 5,
      maxFileSize: "8MB",
      allowedFileTypes: ["image/*"],
    },
  });

  return url; // this is your final image URL
};

export default uploadFile;
