import {CategoryResponse} from '../category/category-response';
import {Creator} from '../user/creator';
import {ComponentFileSummary} from './component-file-summary';

export interface ComponentResponse {
  id: number;
  name: string;
  description: string;
  categories: CategoryResponse[];

  imageUrl: string;

  creator: Creator;

  file: ComponentFileSummary;

  createdAt: string;
  updatedAt: string;

  upVotes: number;
  downVotes: number;
}
