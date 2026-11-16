import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateString: string, lang: "en" | "ml" = "en"): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return lang === "ml" ? "ഇപ്പോൾ" : "Just now";
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return lang === "ml" ? `${diffInMinutes} മിനിറ്റ് മുൻപ്` : `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return lang === "ml" ? `${diffInHours} മണിക്കൂർ മുൻപ്` : `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return lang === "ml" ? `${diffInDays} ദിവസം മുൻപ്` : `${diffInDays}d ago`;
  }
  return date.toLocaleDateString(lang === "ml" ? "ml-IN" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
