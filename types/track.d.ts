export interface DefaultOptons {
  uuid: string | undefined,
  requestUrl: string | undefined,
  historyTracker: boolean,
  hashTracker: boolean,
  domTracker: boolean,
  sdkVersion: string | number,
  extra: Record<string, any> | undefined,
  jsError:boolean
}

export type RouterType = 'history' | 'hash'