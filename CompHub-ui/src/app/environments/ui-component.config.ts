import {environment} from './environment';

const baseUrl = `${environment.apiUrl}/components`;

export const componentConfig = {
  // GET methods
  getAll: `${baseUrl}`,
  getById: `${baseUrl}/{componentId}`,
  search: `${baseUrl}/search`,
  getByUsername: `${baseUrl}/user/{username}`,
  getByUsernameAndCompName: `${baseUrl}/user/{username}/component/{componentName}`,
  userComponentNames: `${baseUrl}/user/{username}/names`,

  // POST methods
  create: `${baseUrl}`,
  copy: `${baseUrl}/copy/{componentId}`,
  vote: `${baseUrl}/vote/{componentId}`,

  // PUT/UPDATE methods
  update: `${baseUrl}/{componentId}`,

  // DELETE methods
  delete: `${baseUrl}/{componentId}`,
};

