export interface FreshProductsModel {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly imageUrl: string;
  readonly featureValue: number;
  readonly ratingValue: number;
  readonly ratingCount: number;
  readonly categoryId: string;
  readonly storeIds: string[];
}
