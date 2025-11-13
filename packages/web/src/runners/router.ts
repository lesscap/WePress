import type { FastifyInstance, FastifyPluginCallback } from 'fastify'

type Dict = Record<string, unknown>
type Plugin = (app: FastifyInstance, config: Dict) => unknown
type Resolve = (e: Error | undefined) => void

export type RouterOptions = {
  routes: Record<string, unknown>
}

export const Router: FastifyPluginCallback<RouterOptions> = (app, opts, done) => {
  const routes = opts.routes
  const names = Object.keys(routes)
  names.forEach(prefix => {
    const config = routes[prefix as keyof typeof routes]
    const [plugin, pluginOpts] = getPluginInfo(config)
    app.register(wrap(plugin, pluginOpts), { ...pluginOpts, prefix })
  })
  done()
}

function getPluginInfo(config: unknown) {
  if (Array.isArray(config)) {
    const plugin = config[0] as Plugin
    const opts = (config[1] ?? {}) as Dict
    return [plugin, opts] as const
  }
  return [config as Plugin, {} as Dict] as const
}

function wrap(plugin: Plugin, opts: Dict) {
  const fn = (app: FastifyInstance, config: Dict, done: Resolve) => {
    const init = async () => {
      await plugin(app, config)
      done(undefined)
    }
    init().catch(done)
  }
  if (opts.plugin) {
    // @ts-expect-error - Fastify plugin symbol requires dynamic property access
    fn[Symbol.for('skip-override')] = true
  }
  return fn
}
