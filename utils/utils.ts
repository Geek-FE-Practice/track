interface SpmMap {
  [key: string]: string | null;
}

// for checking if current element contains the last spm value
// which should be 'data-spm-d' in our case
export const isSpmTail = (current: HTMLElement) => {
  return (
    Object.keys(current.dataset).findIndex((each) => each === "spmD") !== -1
  );
};

// for getting spm value of the current element
export const getElemSpm = (current: HTMLElement, spmMap: SpmMap) => {
  const ds = current.dataset;

  for (let key in ds) {
    //  assume that dataset will be 'data-spm-a'
    if (key.startsWith("spm") && key.charAt(3) in spmMap) {
      spmMap[key.charAt(3)] = ds[key] || null;
    }
  }
};

// for getting the spm trace of the current element all the way up to body element
// in our case we fix it to 4 layers: d1 -> c1 -> b1 -> a1
export const spmLookup = (target: HTMLElement) => {
  const spmMap: SpmMap = {
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
