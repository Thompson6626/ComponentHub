export enum State{
  Loading,
  Loaded,
  Error
}

export interface Loading {
  state: State.Loading;
}

export interface Loaded<T> {
  state: State.Loaded;
  data: T;
}

export interface Errored {
  state: State.Error;
  error: Error;
  networkError?: true;
}

export type LoadingState<T = unknown> = Loading | Loaded<T> | Errored;
