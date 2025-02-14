import {CategoryShowcase} from '../category/category-showcasse';
import {Creator} from '../user/creator';

export interface ComponentShowcase {
  id: number;
  name: string;
  categories: CategoryShowcase[];
  imageUrl: string;
  creator: Creator;
  createdAt: string;
  updatedAt: string;
  description: string;
}
