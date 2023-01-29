export interface FreshProductsDetailedQueryModel {
  readonly name: string;
  readonly price: number;
  readonly imageUrl: string;
  readonly featureValue: number;
  readonly rating: {
    readonly value: number;
    readonly starsValues: number[];
    readonly ratingCount: number;
  };
}
