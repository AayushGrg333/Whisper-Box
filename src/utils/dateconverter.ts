export default function timeAgo(date: string | Date): string {
     const now = new Date();
     const past = typeof date === "string" ? new Date(date) : date;
     const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
 
     if (diffInSeconds < 60) {
         return `${diffInSeconds} second${diffInSeconds === 1 ? "" : "s"} ago`;
     } else if (diffInSeconds < 3600) {
         const minutes = Math.floor(diffInSeconds / 60);
         return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
     } else if (diffInSeconds < 86400) {
         const hours = Math.floor(diffInSeconds / 3600);
         return `${hours} hour${hours === 1 ? "" : "s"} ago`;
     } else if (diffInSeconds < 604800) {
         const days = Math.floor(diffInSeconds / 86400);
         return `${days} day${days === 1 ? "" : "s"} ago`;
     } else {
         const weeks = Math.floor(diffInSeconds / 604800);
         return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
     }
 }
