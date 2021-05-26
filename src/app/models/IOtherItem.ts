export interface IOtherItem {
  add?: string;
  chin?: string;
  songs?: string;
  ru: string;
  cs: string;
  forceRu?: boolean;
}

export interface IOtherList {
  ustav: IOtherItem;
  start: IOtherItem;
  end: IOtherItem;
  posled: IOtherItem;
  pomannik: IOtherItem;
  info: IOtherItem;
  p6: IOtherItem;
  p12: IOtherItem;
  songs: IOtherItem;
}
