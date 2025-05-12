export function formatTime(totalSeconds: number): string {
  if (totalSeconds < 0) totalSeconds = 0;
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function calculatePercentage(current: number, total: number): number {
  if (total <= 0) return 0;
  const percentage = (current / total) * 100;
  return Math.min(Math.max(percentage, 0), 100); // Clamp between 0 and 100
}