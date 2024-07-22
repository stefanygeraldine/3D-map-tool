export type feature = {};
export type features = feature[];
export type onClickShape = (param1: boolean, feature: feature) => void;
export type fn = () => void;

export interface IThreeDimensionsMap {
  elementId: string;
  token: string;

  lng: number;
  lat: number;

  geoJson: JSON;
  featureSelected: feature;

  onLoad: fn;
  onClickShape: onClickShape;
}
