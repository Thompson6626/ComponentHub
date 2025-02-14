import { catchError, map, Observable, of, startWith } from "rxjs";
import { Errored, Loaded, Loading, LoadingState, State } from "../models/loading-state";




export function toLoadingStateStream<T>(source$: Observable<T>): Observable<LoadingState<T>> {
  return source$.pipe(
    // Map the successful data stream to 'loaded' state
    map((data): Loaded<T> => ({ state: State.Loaded, data })),

    // Catch errors and emit 'error' state
    catchError((error): Observable<Errored> =>
      of({ state: State.Error, error })
    ),

    // Emit the 'loading' state initially before data is available
    startWith({ state: State.Loading } as Loading) // Explicitly cast to Loading
  );
}