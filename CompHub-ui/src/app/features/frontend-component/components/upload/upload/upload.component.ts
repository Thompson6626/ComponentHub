import {Component,} from '@angular/core';
import {ToastService} from '../../../../../core/services/Toast/toast.service';
import { ComponentFileService } from '../../../services/ui-componentFile/component-file.service';
import {BaseUploadComponent} from '../base-upload/base-upload.component';

@Component({
  selector: 'app-upload',
  imports: [],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.sass'
})
export class UploadComponent extends BaseUploadComponent{

  constructor(toastService: ToastService,componentFileService: ComponentFileService) {
    super(toastService,componentFileService);
  }

}
