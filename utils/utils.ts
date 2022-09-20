const getElemSpm = (current: HTMLElement, spmMap) => {
  const ds = current.dataset;

  for (let key in ds) {
    //  assume that dataset will be 'data-spm-a'
    if (key.startsWith("spm") && key.charAt(3) in spmMap) {
      spmMap[key.charAt(3)] = ds[key];
    }
  }
};

const spmLookup = (target: HTMLElement) => {
  const spmMap = {
    A: "HARDCODED_HOSTNAME",
    B: null,
    C: null,
    D: null
  };
  const bodyEl = document.querySelector("body");

  while (target && !target.isEqualNode(bodyEl)) {
    getElemSpm(target, spmMap);
    target = target.parentNode as HTMLElement;
  }

  // only return string with matching standard, else return undefined
  if (Object.keys(spmMap).some((key) => spmMap[key] === null)) return;

  const spm = Object.keys(spmMap)
    .map((key) => spmMap[key])
    .join(".");

  return spm;
};

export { spmLookup };
