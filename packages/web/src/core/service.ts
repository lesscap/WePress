import type { Application, Dict, ServiceFactory } from '../types/index.js'

type CleanItem = { name: string; action: () => Promise<void> | void }

export async function start(defines: Record<string, ServiceFactory>, app: Dict = {}) {
  const clearList: CleanItem[] = []

  const names = Object.keys(defines)
  for (let i = 0; i < names.length; i++) {
    const name = names[i]
    const service = defines[name as keyof typeof defines] as ServiceFactory
    const ret = await service(app as unknown as Application)
    const inst = Array.isArray(ret) ? ret[0] : ret
    app[name] = inst
    if (Array.isArray(ret)) {
      clearList.push({ name, action: ret[1] })
    }
  }

  const cleanup = async () => {
    const defers = clearList.map(async item => {
      global.console.log('stop service', item.name)
      await item.action()
    })
    await Promise.all(defers)
  }

  app.$$defines = defines

  return [app as Application, cleanup] as const
}
