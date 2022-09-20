import { spmLookup } from "../utils";
import { EventsType } from "../../constant/index";
import { saveLog } from "../db";

const clickEventHandler = (e) => {
  const spm = spmLookup(e.target);

  if (spm) {
    const preSpm = new URLSearchParams(window.location.search).get("pre_spm");
    saveLog(
      {
        spm,
        preSpm,
        type: EventsType.CLICK,
        time: Date.now()
      },
      EventsType.CLICK
    );

    if (e.target.tagName === "A") {
      e.preventDefault();
      window.location.href = `${e.target.href}?pre_spm=${encodeURIComponent(
        spm
      )}`;
    }
  }
};

export const initClickListener = () => {
  window.addEventListener("click", clickEventHandler);
};
