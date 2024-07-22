import Viewer from "../Viewer";

abstract class Map extends Viewer {
  abstract init(): void;
  abstract mapResize(): void;
  removeMap(elementId: string) {
    const element = document.getElementById(elementId);
    while (element && element.firstChild) {
      element.lastChild && element.removeChild(element.lastChild);
    }
  }
}

export default Map;
