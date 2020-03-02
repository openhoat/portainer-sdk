export interface Initializable<T> {
  readonly config?: T

  init(opt?: Partial<T>): void
}
