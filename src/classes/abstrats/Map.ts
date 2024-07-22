import Viewer from "../Viewer";

abstract class Map extends Viewer {
  abstract init(): void;

  abstract removeMap(elementId: string): void;

  abstract mapRotate(orientation: string): void;

  abstract mapResize(): void;
}

export default Map;
