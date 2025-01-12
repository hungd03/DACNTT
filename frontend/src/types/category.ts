export interface Category {
  _id: string;
  name: string;
  slug: string;
  order: number;
  image: {
    url: string;
    publicId: string;
  };
  parent: string | null;
  isHide: boolean;
  countProduct: number;
  children: Category[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryResponse {
  success: boolean;
  data: Category | Category[];
  message?: string;
}

export interface CategoryRequest {
  name: string;
  parent?: string | null;
  isHide: boolean;
  image?: File;
}
