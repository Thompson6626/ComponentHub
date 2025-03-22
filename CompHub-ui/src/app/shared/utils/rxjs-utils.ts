import {catchError, map, Observable, of, OperatorFunction, startWith} from "rxjs";
import { Errored, Loaded, Loading, LoadingState, State } from "../models/loading-state";

export function withLoadingState<T>(): OperatorFunction<T, LoadingState<T>> {
  return (source$: Observable<T>) =>
    source$.pipe(
      map((data): Loaded<T> => ({ state: State.Loaded, data })),
      catchError((error): Observable<Errored> => of({ state: State.Error, error })),
      startWith({ state: State.Loading } as Loading)
    );
}
