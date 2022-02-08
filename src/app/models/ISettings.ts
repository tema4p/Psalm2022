import {IHistory} from './IHistory';

export interface ISettings {
  fontSize: string;
  fontFamily: string;
  textSource: string;
  textSource2: string;
  translateOrientation: string;
  lineHeight: number;
  themeUI: string;
  isCustomColors: boolean;
  cColor: string;
  cColorSecond: string;
  cColorBg: string;
  cColorDark: string;
  cColorDarkSecond: string;
  cColorDarkBg: string;
  perenos: boolean;
  extraSpace: boolean;
  hyphens: boolean;
  justify: boolean;
  repose: boolean;
  adds: boolean;
  fullscreen: boolean;
  lastPlace: boolean;
  bookMode: boolean;
  bookmarks: number[];
  history: IHistory[];
  psalms: string[];
}
