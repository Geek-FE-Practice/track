import {
  initClickListener,
  initExposure,
  initPvTrack,
  initReportListener
} from "./utils/methods/index";

(function () {
  {
    initClickListener();
    // initCustomClick();
    initReportListener();
    initPvTrack();
    initExposure();
  }
})();
