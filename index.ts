import { initClickListener, initExposure, initPvTrack, initReportListener } from "./utils/methods/index";

export default class Track {
  constructor() {
    this.init();
  }

  private init() {
    initClickListener();
    // initCustomClick();
    initReportListener();
    initPvTrack();
    initExposure();
  }
}
