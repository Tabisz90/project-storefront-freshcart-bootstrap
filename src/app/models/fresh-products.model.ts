export interface FreshProductsModel {
  readonly name: string;
  readonly price: number;
  readonly imageUrl: string;
  readonly featureValue: number;
  readonly ratingValue: number;
  readonly ratingCount: number;
  readonly categoryId: string;
  readonly storeIds: string[];
}
