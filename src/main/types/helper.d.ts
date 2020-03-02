export interface Helperable {
  name: string
  staticImplements: <T>() => (__: T) => void
  version: string
}
