import mapboxgl from "mapbox-gl";
import tb from "threebox-plugin";

declare global {
  interface Window {
    mapboxMap: mapboxgl.Map;
    tb: tb;
  }
}
