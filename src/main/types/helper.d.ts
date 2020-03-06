export interface Helperable {
  staticImplements: <T>() => (__: T) => void
}
