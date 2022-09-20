import { HashEvents, HistoryEvents } from "../cosntant/index";
import type { RouterType } from "../types/track";

export const initPvTrack = () => {
  initHistoryEvents()
  initRouterChangeListener()
}

export const initHistoryEvents = () => {
  window.history["pushState"] = createHistoryEvnent("pushState");
  window.history["replaceState"] = createHistoryEvnent("replaceState");
};

export const initRouterChangeListener = () => {
  HistoryEvents.forEach((event) => {
    window.addEventListener(event, () => {
      handlePvReport(event, "history");
    });
  });

  HashEvents.forEach((event) => {
    window.addEventListener(event, () => {
      handlePvReport(event, "hash");
    }); 
  });
};

function createHistoryEvnent<T extends keyof History>(type: T): any {
  const origin = history[type];
  return function (this: any) {
    const res = origin.apply(this, arguments);
    var e = new Event(type);
    window.dispatchEvent(e);
    return res;
  };
}

function handlePvReport(event: string, type: RouterType) {
  //TODO: 待上报
}
