import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { intervalToDuration, formatDuration } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

// Helper function to format duration from milliseconds into HH:MM:SS
export const formatVodDuration = (milliseconds: number): string => {
  if (isNaN(milliseconds) || milliseconds < 0) return "00:00";
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor((totalSeconds % 3600) / 60);
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

export const formatAnalyticsValue = (type: string, value: number): string => {
  switch (type) {
    case 'STREAM_TIME':
      const totalMinutes = Math.ceil(value / 60); // Округляем минуты в большую сторону
      if (totalMinutes < 60) return `${totalMinutes}m`;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}h ${minutes}m`;
    case 'STREAM_VIEWERS':
      const viewers = Math.ceil(value); // Округляем зрителей в большую сторону
      if (viewers >= 1000) return `${(viewers / 1000).toFixed(0)}K`; // Округляем до целых тысяч
      return viewers.toString();
    case 'FOLLOWER':
      const followers = Math.ceil(value); // Округляем подписчиков в большую сторону
      if (followers >= 1000) return `${(followers / 1000).toFixed(0)}K`; // Округляем до целых тысяч
      return followers.toString();
    default:
      return Math.ceil(value).toString(); // По умолчанию округляем в большую сторону
  }
};