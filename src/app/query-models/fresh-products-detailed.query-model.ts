export interface FreshProductsDetailedQueryModel {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly imageUrl: string;
  readonly featureValue: number;
  readonly storeIds: string[];
  readonly rating: {
    readonly value: number;
    readonly starsValues: number[];
    readonly ratingCount: number;
  };
}
