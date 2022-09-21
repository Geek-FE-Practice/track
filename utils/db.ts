import { api } from "../constant/api";
import { EventsType } from "../constant/index";

const StorageName = "spmLogs";
const UploadThreshold = 5;
const initialState = {
  click: [],
  exposure: [],
  custom: []
};

export const readLogs = () => {
  try {
    if (!localStorage.getItem(StorageName)) return initialState;

    const logs = localStorage.getItem(StorageName);

    return JSON.parse(logs!);
  } catch {
    return initialState;
  }
};

export const saveLog = (
  log: any,
  type: typeof EventsType[keyof typeof EventsType]
) => {
  const logs = readLogs();

  logs[type].push(log);
  localStorage.setItem(StorageName, JSON.stringify(logs));
};

export const uploadLogs = () => {
  const logs = readLogs();
  let newLogs = { ...logs };

  Object.keys(logs).forEach((type) => {
    const currentLogs = logs[type];

    if (currentLogs.length >= UploadThreshold) {
      // try upload (should be the oldest 5)
      const toBeUploaded = currentLogs.slice(0, UploadThreshold);
      const result = navigator.sendBeacon(
        api[type as keyof typeof initialState],
        JSON.stringify({
          data: toBeUploaded
        })
      );

      if (result) {
        newLogs[type] = currentLogs.slice(UploadThreshold);
      }
    }
  });

  localStorage.setItem(StorageName, JSON.stringify(newLogs));
};
