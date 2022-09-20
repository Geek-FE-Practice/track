export const EffectiveInterval = 300
export const weakMap = new WeakMap()
export const intersectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.intersectionRatio >= 0.3) {
      weakMap.set(entry.target, setTimeout(() => {
        //TODO: 待上报
      }, EffectiveInterval))
    } else {
      if(weakMap.get(entry.target)) {
        clearTimeout(weakMap.get(entry.target))
      }
    }
  })
})

export const initExposure = () => {
  initExposureEventListener()
}

export const destroyed = () => {
  intersectionObserver.disconnect()
}

const initExposureEventListener = () => {
  traverse(document.body)
}

// 层次遍历所有 dom 节点
function traverse (node: HTMLElement) {
    if(!node) {
      return
    }

    const queue: HTMLElement[] = [node]
    while(queue.length) {
      const element = queue.shift()
      
      if(!element) {
        continue
      } else if (element.dataset.track !== undefined) {
        addExposureListener(element, element.dataset.track)
        continue
      }

      for(const v of element.children) {
        queue.push(v as HTMLElement)
      }
    }
}

function addExposureListener(element: HTMLElement,trackId: string) {
  intersectionObserver.observe(element)
}

