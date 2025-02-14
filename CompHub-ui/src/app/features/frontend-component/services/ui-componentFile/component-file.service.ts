import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { componentFileConfig } from '../../../../environments/ui-component-file.config';
import {ComponentFileResponse} from '../../models/component/component-file-response';
import {Observable} from 'rxjs';
import {replaceUrlPlaceholders} from '../../../../shared/utils/string-utils';

@Injectable({
  providedIn: 'root'
})
export class ComponentFileService {

  private GET_BY_ID_URL = componentFileConfig.getById;
  private UPLOAD_URL = componentFileConfig.upload;
  private UPDATE_URL = componentFileConfig.update;
  private DELETE_URL = componentFileConfig.delete;


  private http = inject(HttpClient);


  upload(file: File, componentId: number): Observable<ComponentFileResponse> {
    const formData = new FormData();

    formData.append('file', file);

    const modifiedUrl = replaceUrlPlaceholders(this.UPLOAD_URL,{ componentId: componentId.toString() });

    return this.http.post<ComponentFileResponse>(modifiedUrl, formData, {});
  }

  delete(fileId: number): Observable<void> {
    const modifiedUrl = replaceUrlPlaceholders(this.DELETE_URL, { fileId: fileId.toString() });
    return this.http.delete<void>(modifiedUrl);
  }

  getById(id: number): Observable<ComponentFileResponse> {
    const modifiedUrl = replaceUrlPlaceholders(this.GET_BY_ID_URL,{ fileId:id.toString()});
    return this.http.get<ComponentFileResponse>(modifiedUrl);
  }

  update(file: File, fileId: number){

    const formData = new FormData();
    formData.append('file', file);

    const modifiedUrl = replaceUrlPlaceholders(this.UPDATE_URL,{ fileId: fileId.toString() });

    return this.http.put<ComponentFileResponse>(modifiedUrl, formData, {});
  }



}
