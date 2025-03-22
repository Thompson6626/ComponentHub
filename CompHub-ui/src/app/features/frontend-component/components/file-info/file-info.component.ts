import {Component, inject, input, model} from '@angular/core';
import {AsyncPipe, NgClass} from "@angular/common";
import {Base64ToTextPipe} from "../../../../shared/pipes/binary-decoder.pipe";
import {ProgressSpinner} from "primeng/progressspinner";
import {UploadComponent} from "../upload/upload/upload.component";
import {Loaded, LoadingState, State} from "../../../../shared/models/loading-state";
import {Observable, of} from 'rxjs';
import {ComponentFileResponse} from '../../models/component/component-file-response';
import {ComponentFileService} from '../../services/ui-componentFile/component-file.service';
import {SmallUploadComponent} from '../upload/small-upload/small-upload.component';
import {ButtonDirective} from 'primeng/button';
import {ToastService} from '../../../../core/services/Toast/toast.service';

@Component({
  selector: 'app-file-info',
  imports: [
    AsyncPipe,
    ProgressSpinner,
    UploadComponent,
    Base64ToTextPipe,
    SmallUploadComponent,
    NgClass,
    ButtonDirective
  ],
  templateUrl: './file-info.component.html',
  styleUrl: './file-info.component.sass'
})
export class FileInfoComponent {

    protected readonly State = State;
    private toastService = inject(ToastService);

    file$= model.required<Observable<LoadingState<ComponentFileResponse>>>();
    isOwnUser$ = input.required<Observable<boolean>>();
    componentId = input.required<number>();

    private componentFileService = inject(ComponentFileService);

    isCodeView = true

  refreshFile(fileResponse: ComponentFileResponse){
    this.file$.set(of({ state: State.Loaded, data: fileResponse }));
  }

  deleteFile(fileId: number){
      this.componentFileService.delete(fileId).subscribe({
        next: data => this.file$.set(of({ state: State.Loaded, data: null} as Loaded<any>)),
        error: () => this.toastService.showErrorToast('Error deleting','Could not delete file')
      });
  }


}
