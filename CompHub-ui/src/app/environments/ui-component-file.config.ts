import {environment} from './environment';

const baseUrl = `${environment.apiUrl}/components/files`;


export const componentFileConfig = {
  getById: `${baseUrl}/{fileId}`,
  upload: `${baseUrl}/{componentId}`,
  update: `${baseUrl}/{fileId}`,
  delete: `${baseUrl}/{fileId}`
};


