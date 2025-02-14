import {Component, input, output} from '@angular/core';
import {ToastService} from '../../../../../core/services/Toast/toast.service';
import {ComponentFileService} from '../../../services/ui-componentFile/component-file.service';
import {ComponentFileResponse} from '../../../models/component/component-file-response';

@Component({
  selector: 'app-base-upload',
  imports: [],
  templateUrl: './base-upload.component.html',
  styleUrl: './base-upload.component.sass'
})
export class BaseUploadComponent {
  readonly allowedFiles: string = '.jsx,.js,.tsx,.ts,.html';
  private maxSize =  50 * 1024 * 1024;
  private selectedFile: File | null = null;

  componentId = input.required<number>();
  update = input(false);

  constructor(private toastService: ToastService, private componentFileService: ComponentFileService) {
  }

  onFileUploaded = output<ComponentFileResponse>();

  onFileSelected(event: Event){
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length <= 0) {
      return;
    }
    this.selectedFile = input.files[0];

    if(!this.selectedFile){
      return;
    }

    if (this.selectedFile.size > this.maxSize) {
      this.toastService.showErrorToast("File Error",`File size exceeds maximum of ${this.maxSize} bytes.`);
      return;
    }

    const uploadObservable = this.update()
      ? this.componentFileService.update(this.selectedFile,this.componentId()) :
      this.componentFileService.upload(this.selectedFile,this.componentId());

    uploadObservable.subscribe({
      next: data => this.onFileUploaded.emit(data),
      error: () => {
        this.toastService.showErrorToast(this.update() ? "Update": "Upload" + " Failed", "An error occurred while " + this.update() ? "updating": "uploading");
      }
    });

  }

}
