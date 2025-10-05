import { intervalToDuration, formatDuration } from "date-fns";

export const getMinioUrl = (fileName: string | null | undefined): string => {
  if (!fileName || typeof fileName !== 'string') {
    return "/placeholder.jpg"; 
  }
  
  // Если это уже локальный статический путь, возвращаем его напрямую
  if (fileName.startsWith('/')) {
    return fileName;
  }
  
  // Убедимся, что NEXT_PUBLIC_BLOB_URL определен
  if (!process.env.NEXT_PUBLIC_BLOB_URL) {
    console.error("NEXT_PUBLIC_BLOB_URL is not defined. Minio URLs might be broken. Falling back to provided filename.");
    return fileName; // Если URL отсутствует, возвращаем само имя файла (которое здесь является строкой)
  }
  
  // Формируем полный URL Minio
  const fullUrl = `${process.env.NEXT_PUBLIC_BLOB_URL}/${fileName}`;
  return fullUrl;
};

// Helper function to format duration from seconds into HH:MM:SS
export const formatVodDuration = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  
  const totalSeconds = Math.floor(seconds); // Input is already in seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(String(hours).padStart(2, '0'));
  parts.push(String(minutes).padStart(2, '0'));
  parts.push(String(remainingSeconds).padStart(2, '0'));

  return parts.join(':');
};

// Helper function to format live stream duration in HH:MM:SS
export const formatLiveDuration = (startDate: string | null | undefined): string => {
  if (!startDate) return "00:00:00";
  
  const start = new Date(startDate);
  const now = new Date();

  if (isNaN(start.getTime())) return "00:00:00";

  const duration = intervalToDuration({ start, end: now });

  const hours = duration.hours ? String(duration.hours).padStart(2, '0') : '00';
  const minutes = duration.minutes ? String(duration.minutes).padStart(2, '0') : '00';
  const seconds = duration.seconds ? String(duration.seconds).padStart(2, '0') : '00';

  return `${hours}:${minutes}:${seconds}`;
};