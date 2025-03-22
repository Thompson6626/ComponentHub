import {Component, inject, OnInit} from '@angular/core';
import {Loaded, LoadingState, State} from '../../../../../shared/models/loading-state';
import {ComponentService} from '../../../services/ui-component/component.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {catchError, combineLatest, filter, map, Observable, of, switchMap, throwError} from 'rxjs';
import {ComponentResponse} from '../../../models/component/component-response';
import {AsyncPipe, DatePipe, NgClass} from '@angular/common';
import {ProgressSpinner} from 'primeng/progressspinner';
import {VoteType} from '../../../models/vote/vote-type';
import {FormsModule} from '@angular/forms';
import {AuthStateService} from '../../../../../core/services/AuthState/auth-state.service';
import {ComponentFileService} from '../../../services/ui-componentFile/component-file.service';
import {ComponentFileResponse} from '../../../models/component/component-file-response';
import {FileInfoComponent} from '../../file-info/file-info.component';
import {Chip} from 'primeng/chip';
import {Tooltip} from 'primeng/tooltip';
import {withLoadingState} from '../../../../../shared/utils/rxjs-utils';

@Component({
  selector: 'app-component-showcase',
    imports: [
        AsyncPipe,
        ProgressSpinner,
        DatePipe,
        FormsModule,
        NgClass,
        FileInfoComponent,
        Chip,
        Tooltip,
        RouterLink
    ],
  templateUrl: './component-showcase.component.html',
  styleUrl: './component-showcase.component.sass'
})
export class ComponentShowcaseComponent implements OnInit {

  protected readonly State = State;
  private readonly activatedRoute = inject(ActivatedRoute);
  private componentService = inject(ComponentService);
  authStateService = inject(AuthStateService);
  private componentFileService= inject(ComponentFileService);

  private currentVote = VoteType.NONE;


  likeChecked = false;
  dislikeChecked = false;

  componentResponse$! : Observable<LoadingState<ComponentResponse>>;
  isOwnUser$!: Observable<boolean>;
  file$!: Observable<LoadingState<ComponentFileResponse>>;


  ngOnInit(): void {
    const snapshot = this.activatedRoute.snapshot.paramMap;
    const username = snapshot.get('username');
    const componentName = snapshot.get('componentName');

    if(!username || !componentName){
      this.componentResponse$ = of({state:State.Error, error: Error("Username and component must be provided")});
    }else{
      this.componentResponse$ = this.componentService.getByUsernameAndCompName(username,componentName).pipe(withLoadingState());

      this.isOwnUser$ = combineLatest([
        this.componentResponse$,
        this.authStateService.userDetails$
      ]).pipe(
        map(([data, details]) => {
          if (!data || !details) return false;
          return data.state === State.Loaded && data.data.creator.username === details.username;
        })
      );


      this.file$ = this.componentResponse$.pipe(
        filter(response => response.state === State.Loaded),
        switchMap(response =>
          response.data?.file
            ? this.componentFileService.getById(response.data.file.id).pipe(withLoadingState())
            : of({ state:State.Loaded, data: null} as Loaded<any>)
        )
      );



    }
  }

  vote(id: number, voteType: VoteType) {
    const previousVote = this.currentVote; // Store previous state
    const previousLikeChecked = this.likeChecked;
    const previousDislikeChecked = this.dislikeChecked;

    if (this.currentVote === voteType) {
      this.currentVote = VoteType.NONE;
      this.likeChecked = false;
      this.dislikeChecked = false;
    } else {
      this.currentVote = voteType;
      this.likeChecked = voteType === VoteType.UPVOTE;
      this.dislikeChecked = voteType === VoteType.DOWNVOTE;
    }

    this.componentService.vote(id, { voteType: this.currentVote }).pipe(
      catchError(error => {
        console.error("Vote failed:", error);
        // Revert state if API call fails
        this.currentVote = previousVote;
        this.likeChecked = previousLikeChecked;
        this.dislikeChecked = previousDislikeChecked;
        return throwError(() => error);
      })
    ).subscribe();
  }

  upvote(id: number): void {
    this.vote(id, VoteType.UPVOTE);
  }

  downvote(id: number): void {
    this.vote(id, VoteType.DOWNVOTE);
  }




}
