(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  // for checking if current element contains the last spm value
  // which should be 'data-spm-d' in our case
  const isSpmTail = (current) => {
      return (Object.keys(current.dataset).findIndex((each) => each === "spmD") !== -1);
  };
  // for getting spm value of the current element
  const getElemSpm = (current, spmMap) => {
      const ds = current.dataset;
      for (let key in ds) {
          //  assume that dataset will be 'data-spm-a'
          if (key.startsWith("spm") && key.charAt(3) in spmMap) {
              spmMap[key.charAt(3)] = ds[key] || null;
          }
      }
  };
  // for getting the spm trace of the current element all the way up to html element
  // in our case we fix it to 4 layers: d1 -> c1 -> b1 -> a1
  const spmLookup = (target) => {
      const spmMap = {
          A: "HARDCODED_HOSTNAME",
          B: null,
          C: null,
          D: null
      };
      const htmlEl = document.querySelector("html");
      while (target && !target.isEqualNode(htmlEl)) {
          getElemSpm(target, spmMap);
          target = target.parentNode;
      }
      // only return string with matching standard, else return undefined
      if (Object.keys(spmMap).some((key) => spmMap[key] === null))
          return;
      const spm = Object.keys(spmMap)
          .map((key) => spmMap[key])
          .join(".");
      return spm;
  };

  const EventsType = {
      CLICK: "click",
      EXPOSURE: "exposure",
      CUSTOM: "custom"
  };
  const HistoryEvents = [
      'pushState',
      'popState',
      'replaceState'
  ];
  const HashEvents = [
      'hashchange'
  ];

  const api = {
      click: "http://127.0.0.1:8000/data/spm",
      exposure: "http://127.0.0.1:8000/data/spm",
      custom: "http://127.0.0.1:8000/data/custom"
  };

  const StorageName = "spmLogs";
  const UploadThreshold = 5;
  const initialState = {
      click: [],
      exposure: [],
      custom: []
  };
  const readLogs = () => {
      try {
          if (!localStorage.getItem(StorageName))
              return initialState;
          const logs = localStorage.getItem(StorageName);
          return JSON.parse(logs);
      }
      catch (_a) {
          return initialState;
      }
  };
  const saveLog = (log, type) => {
      const logs = readLogs();
      logs[type].push(log);
      localStorage.setItem(StorageName, JSON.stringify(logs));
  };
  const uploadLogs = () => {
      const logs = readLogs();
      let newLogs = Object.assign({}, logs);
      Object.keys(logs).forEach((type) => {
          const currentLogs = logs[type];
          if (currentLogs.length >= UploadThreshold) {
              // try upload (should be the oldest 5)
              const toBeUploaded = currentLogs.slice(0, UploadThreshold);
              const result = navigator.sendBeacon(api[type], JSON.stringify({
                  data: toBeUploaded
              }));
              if (result) {
                  newLogs[type] = currentLogs.slice(UploadThreshold);
              }
          }
      });
      localStorage.setItem(StorageName, JSON.stringify(newLogs));
  };

  const clickEventHandler = (e) => {
      const spm = spmLookup(e.target);
      if (spm) {
          const preSpm = new URLSearchParams(window.location.search).get("pre_spm");
          saveLog({
              spm,
              preSpm,
              type: EventsType.CLICK,
              time: Date.now()
          }, EventsType.CLICK);
          if (e.target.tagName === "A") {
              e.preventDefault();
              window.location.href = `${e.target.href}?pre_spm=${encodeURIComponent(spm)}`;
          }
      }
  };
  const initClickListener = () => {
      window.addEventListener("click", clickEventHandler);
  };

  const EffectiveInterval = 300;
  const weakMap = new WeakMap();
  const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.3) {
              weakMap.set(entry.target, setTimeout(() => {
                  saveLog({
                      spm: spmLookup(entry.target),
                      preSpm: null,
                      type: EventsType.EXPOSURE,
                      time: Date.now()
                  }, EventsType.EXPOSURE);
              }, EffectiveInterval));
          }
          else {
              if (weakMap.get(entry.target)) {
                  clearTimeout(weakMap.get(entry.target));
              }
          }
      });
  });
  const initExposure = () => {
      initExposureEventListener();
  };
  const initExposureEventListener = () => {
      traverse(document.body);
  };
  // 层次遍历所有 dom 节点
  function traverse(node) {
      if (!node) {
          return;
      }
      const queue = [node];
      while (queue.length) {
          const element = queue.shift();
          if (!element) {
              continue;
          }
          else if (isSpmTail(element)) {
              addExposureListener(element);
              continue;
          }
          for (const v of element.children) {
              queue.push(v);
          }
      }
  }
  function addExposureListener(element) {
      intersectionObserver.observe(element);
  }

  const initPvTrack = () => {
      initHistoryEvents();
      initRouterChangeListener();
  };
  const initHistoryEvents = () => {
      window.history["pushState"] = createHistoryEvnent("pushState");
      window.history["replaceState"] = createHistoryEvnent("replaceState");
  };
  const initRouterChangeListener = () => {
      HistoryEvents.forEach((event) => {
          window.addEventListener(event, () => {
          });
      });
      HashEvents.forEach((event) => {
          window.addEventListener(event, () => {
          });
      });
  };
  function createHistoryEvnent(type) {
      const origin = history[type];
      return function () {
          const res = origin.apply(this, arguments);
          var e = new Event(type);
          window.dispatchEvent(e);
          return res;
      };
  }

  const initReportListener = () => {
      document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") {
              uploadLogs();
          }
      });
      setInterval(() => {
          uploadLogs();
      }, 10000);
  };

  (function () {
      {
          initClickListener();
          // initCustomClick();
          initReportListener();
          initPvTrack();
          initExposure();
      }
  })();

}));
