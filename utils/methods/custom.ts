import { EventsType } from "../../constant/index";
import { saveLog } from "../db.js";

const saveCustom = (data: string) => {
  saveLog(
    {
      data,
      type: EventsType.CUSTOM,
      time: Date.now()
    },
    EventsType.CUSTOM
  );
};

export const initCustomClick = () => {
  // window._save_custom_log = saveCustom;
};
