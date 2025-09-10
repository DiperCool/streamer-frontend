import { intervalToDuration, formatDuration } from "date-fns";

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

// Helper function to format duration from milliseconds into HH:MM:SS
export const formatVodDuration = (milliseconds: number): string => {
  if (isNaN(milliseconds) || milliseconds < 0) return "00:00";
  
  const totalSeconds = Math.floor(milliseconds / 1000);
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