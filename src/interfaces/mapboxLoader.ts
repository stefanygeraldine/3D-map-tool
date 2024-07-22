import { LngLatLike } from "mapbox-gl";

export interface IMapboxLoader {
  elementId: string;
  lng: number;
  lat: number;
}

export interface IOptions {
  container: string;
  style: string;
  center: LngLatLike;
  zoom: number;
  minZoom: number;
  pitch: number;
  heading: number;
  antialias: boolean;
}
