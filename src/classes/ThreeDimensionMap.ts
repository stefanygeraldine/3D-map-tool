import { feature, fn, IThreeDimensionsMap, onClickShape } from "../interfaces";
import get from "lodash/get";
import MapboxLoader from "./abstrats/MapboxLoader";
import { AnyLayer } from "mapbox-gl";

const buildingsLayerColor = "#fff";
const compositeNames = {
  compositeSource: "composite",
  compositeSourceLayer: "building",
  compositeLayer: "3d-buildings",
};
const compositeBuildingsLayer: AnyLayer = {
  id: compositeNames.compositeLayer,
  source: compositeNames.compositeSource,
  "source-layer": compositeNames.compositeSourceLayer,
  // 'filter': ['==', 'extrude', 'true'],
  type: "fill-extrusion",
  paint: {
    "fill-extrusion-color": [
      "case",
      ["boolean", ["feature-state", "hover"], false],
      "transparent",
      buildingsLayerColor,
    ],
    "fill-extrusion-height": ["get", "height"],
    "fill-extrusion-base": ["get", "min-height"],
    "fill-extrusion-opacity": 0.9,
  },
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

    if (this.isValidToken) {
      super.init();
      this.addEventListeners();
    } else {
      super.showUnauthorizedMessage(this.elementId);
    }
  }

  public mapRotate(orientation: "left" | "right") {
    const easing = (t: number) => t * (2 - t);
    const deltaDegrees = 45;
    const bearing =
      orientation === "left"
        ? window.mapboxMap.getBearing() - deltaDegrees
        : window.mapboxMap.getBearing() + deltaDegrees;

    window.mapboxMap.easeTo({
      bearing,
      easing,
    });
  }

  public showBuildingsLayer() {
    window.mapboxMap.setLayoutProperty(
      compositeNames.compositeLayer,
      "visibility",
      "visible",
    );
  }

  public hiddenBuildingsLayer() {
    window.mapboxMap.setLayoutProperty(
      compositeNames.compositeLayer,
      "visibility",
      "none",
    );
  }

  protected addEventListeners() {
    window.mapboxMap.on("style.load", () => {
      window.mapboxMap.addLayer(compositeBuildingsLayer);
    });
  }
}

export default ThreeDimensionMap;
