export const getMinioUrl = (fileName: string) => {
  if (fileName.startsWith('/')) {
    return fileName; // It's a local static asset
  }
  // Ensure NEXT_PUBLIC_MINIO_URL is defined before using it
  if (!process.env.NEXT_PUBLIC_MINIO_URL) {
    console.error("NEXT_PUBLIC_MINIO_URL is not defined. Minio URLs might be broken.");
    return fileName; // Fallback to just the filename if URL is missing
  }
  return `${process.env.NEXT_PUBLIC_MINIO_URL}/${fileName}`;
};