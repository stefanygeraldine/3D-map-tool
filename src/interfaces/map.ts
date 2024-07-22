import { feature, fn, onClickShape } from "./threeDimensionsMap";

export interface Map {
  elementId: string;

  lng: number;
  lat: number;

  geoJson: JSON;
  featureSelected: feature;

  onLoad: fn;
  onClickShape: onClickShape;
}
