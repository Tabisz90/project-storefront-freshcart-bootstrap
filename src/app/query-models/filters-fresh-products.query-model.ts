export interface FiltersFreshProductsQueryModel {
  readonly priceFrom: number;
  readonly priceTo: number;
  readonly minRatingValue: number;
  readonly storeIds: string[];
}
