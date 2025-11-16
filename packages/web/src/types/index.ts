export type Dict = Record<string, unknown>

export type ServiceFactory = (
  app: Application,
) => unknown | Promise<unknown> | readonly [unknown, () => void | Promise<void>]

export type Application = Dict & {
  $$defines?: Record<string, ServiceFactory>
}
