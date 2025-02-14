import {environment} from './environment';

const baseUrl = `${environment.apiUrl}/components/category`;


export const categoryConfig = {
  getAll: `${baseUrl}`,
  create: `${baseUrl}`,
  update: `${baseUrl}/{categoryId}`,
  delete: `${baseUrl}/{categoryId}`,
}
