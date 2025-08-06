export const getMinioUrl = (fileName: string) =>
    `${process.env.NEXT_PUBLIC_MINIO_URL}/${fileName}`;