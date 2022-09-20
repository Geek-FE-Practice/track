export const createHistoryEvnent = <T extends keyof History>(type: T): () => any => {
  const origin = history[type];
  return function (this: any) {
      const res = origin.apply(this, arguments)
      var e = new Event(type)
      window.dispatchEvent(e)
      return res;
  }
}
export const initHistoryEvents = () => {
  window.history['pushState'] = createHistoryEvnent("pushState")
  window.history['replaceState'] = createHistoryEvnent('replaceState')
}

export const initRouterChangeListener = () => {
  
}