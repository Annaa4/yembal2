// Copie officielle du stimulus-loading.js
export function eagerLoadControllersFrom(glob, application) {
  const controllerFiles = Object.entries(import.meta.glob(glob, { eager: true }))
  for (const [path, controller] of controllerFiles) {
    const identifier = path
      .split("/")
      .pop()
      .replace(/_controller\.js$/, "")
      .replace(/_/g, "-")
    application.register(identifier, controller.default)
  }
} 