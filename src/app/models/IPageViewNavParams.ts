export interface IPageViewNavParams {
  page?: number;
  item: IPageViewNavItem;
}

export interface IPageViewNavItem {
  kafisma?: string;
  isFavorite?: boolean;
  psalm?: string;
  add?: string;
  chin?: string;
  songs?: string;
  forceRu?: boolean;
  ru?: string;
  cs?: string;
}

