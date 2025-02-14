import {inject, Injectable} from '@angular/core';
import {MessageService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private messageService = inject(MessageService);

  showErrorToast(_summary:string,_detail:string,_sticky: boolean = false){
    this.messageService.add({
      severity: 'error',
      summary: _summary,
      detail: _detail,
      sticky: _sticky
    })
  }
  showSuccessToast(_summary:string,_detail:string){
    this.messageService.add({
      severity: 'success',
      summary: _summary,
      detail: _detail,
    })
  }

  clearAll(){
    this.messageService.clear();
  }



}

