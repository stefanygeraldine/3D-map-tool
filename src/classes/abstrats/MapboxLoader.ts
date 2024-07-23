import mapboxgl from "mapbox-gl";

import Map from "./Map";
import { IMapboxLoader, IOptions } from "../../interfaces/mapboxLoader";
// map options
const mapboxToken =
  "pk.eyJ1Ijoic2NhcmJhbGxvMjAyMSIsImEiOiJja3RvcXE1NzEwOHk0MnZxc3FobXo4bDE4In0.gX8dCNsJN9wN94P_hLSywg";
const minZoom = 12;
const zoom = 17.5;
const pitch = 60;
const heading = 0;
const FIELD_OF_VIEW = 8;

abstract class MapboxLoader extends Map implements IMapboxLoader {
  elementId: string;
  lng: number;
  lat: number;

  protected constructor(
    elementId: string,
    token: string,
    lng: number,
    lat: number,
  ) {
    super(token);
    super.validateToken();

    this.elementId = elementId;
    this.lng = lng;
    this.lat = lat;
  }

  init() {
    console.log("init");
    mapboxgl.accessToken = mapboxToken;

    function animate() {
      requestAnimationFrame(animate);
    }

    const mapOptions: IOptions = {
      container: this.elementId,
      //style: "mapbox://styles/mapbox/outdoors-v11",
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [this.lng, this.lat],
      zoom,
      minZoom,
      pitch,
      heading,
      antialias: true,
    };
    const map = new mapboxgl.Map(mapOptions);

    map.transform.fov = FIELD_OF_VIEW;

    window.mapboxMap = map;
    const controls: HTMLElement | null = document.querySelector(
      ".mapboxgl-control-container",
    );
    if (controls) controls.style.display = "none";
  }

  mapResize() {
    window.mapboxMap.resize();
  }
  protected addEventListeners() {
    // Placeholder for adding event listeners in child classes
  }
}

export default MapboxLoader;
