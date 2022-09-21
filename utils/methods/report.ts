import { uploadLogs } from "../db";

export const initReportListener = () => {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      uploadLogs();
    }
  });

  setInterval(() => {
    uploadLogs();
  }, 10000);
};
