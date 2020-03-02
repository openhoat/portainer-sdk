export interface JsonArray extends ArrayLike<JsonEntry> {}

export type JsonEntry = Primitive | JsonArray | JsonMap

export interface JsonMap extends Mapable<JsonEntry> {}

export interface Mapable<T> {
  [key: string]: T
}

export type Optional<T> = T | undefined

export declare type Primitive = string | number | boolean | undefined

export type OneOrMany<T> = T | T[]
