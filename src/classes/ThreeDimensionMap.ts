import { feature, fn, IThreeDimensionsMap, onClickShape } from "../interfaces";
import get from "lodash/get";
import MapboxLoader from "./abstrats/MapboxLoader";

const compositeNames = {
  compositeSource: "composite",
  compositeSourceLayer: "building",
  compositeLayer: "3d-buildings",
};

class ThreeDimensionMap extends MapboxLoader implements IThreeDimensionsMap {
  elementId: string;
  readonly token: string;
  geoJson: JSON;
  onClickShape: onClickShape;
  lng: number;
  lat: number;
  featureSelected: feature;
  onLoad: fn;

  constructor(
    elementId: string,
    token: string,
    geoJson: JSON,
    onClickShape: onClickShape,
    lng: number,
    lat: number,
    featureSelected: feature,
    onLoad: fn,
  ) {
    const _lng =
      lng || get(geoJson, "features[0].center[0]", -73.96368733310645);
    const _lat =
      lat || get(geoJson, "features[0].center[1]", 40.77900196036666);

    super(elementId, token, _lng, _lat);

    this.elementId = elementId;
    this.token = token;
    this.geoJson = geoJson;
    this.featureSelected = featureSelected;
    this.onLoad = onLoad;
    this.onClickShape = onClickShape;

    this.lng = _lng;
    this.lat = _lat;
  }

  public init(): void {
    super.setMapWrapperStyle(this.elementId);
    super.removeMap(this.elementId);

    this.isValidToken
      ? super.init()
      : super.showUnauthorizedMessage(this.elementId);
  }
}

export default ThreeDimensionMap;
