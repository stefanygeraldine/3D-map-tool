import get from "lodash/get";
import * as THREE from "three";
import utils from "threebox-plugin/src/utils/utils";
import threeBox from "threebox-plugin";
import { feature, features } from "../interfaces";
import { Map, MapContextEvent } from "mapbox-gl";

export function generateMesh(coordinates, color) {
  const points = [];
  const init = utils.projectToWorld([
    coordinates[0][0][0],
    coordinates[0][0][1],
    coordinates[0][0][2],
  ]);
  coordinates[0].map((point) => {
    const pos = utils.projectToWorld([point[0], point[1], point[2]]);
    const x = utils.toDecimal(pos.x - init.x, 9);
    const y = utils.toDecimal(pos.y - init.y, 9);
    const z = utils.toDecimal(pos.z - init.z, 9);

    points.push(x);
    points.push(y);
    points.push(z);
  });

  const position = new THREE.Float32BufferAttribute(points, 3);
  const meshGeometry = new THREE.BufferGeometry();

  meshGeometry.setAttribute("position", position);
  meshGeometry.computeVertexNormals();

  const material = new THREE.MeshPhongMaterial({
    color,
    refractionRatio: 0.8,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(meshGeometry, material);

  const edges = new THREE.EdgesGeometry(meshGeometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: lineColor }),
  );

  return { mesh, line };
}

// colors
const lineColor = 0x2a6487;
const primaryColor = 0x6fa9c7;

const threeBoxSettings = {
  defaultLights: true,
  enableSelectingFeatures: false, // change this to false to disable fill-extrusion features selection
  enableSelectingObjects: false, // change this to false to disable 3D objects selection
  enableDraggingObjects: true, // change this to false to disable 3D objects drag & move once selected
  enableRotatingObjects: true, // change this to false to disable 3D objects rotation once selected
  enableTooltips: false, // change this to false to disable default tooltips on fill-extrusion and 3D models
};

export function addCustomBuildings(features: features) {
  let color = primaryColor;

  features.map((unit, i) => {
    const coordinates = get(unit, "geometry.coordinates", []);
    const center = get(unit, "center", [0, 0]);

    const mesh = generateMesh(coordinates, color).mesh;
    const line = generateMesh(coordinates, color).line;

    const Object3D = window.tb.Object3D({ obj: mesh });

    Object3D.setTranslate(center);

    Object3D.userData.properties = unit.properties;
    Object3D.userData.obj.position.x = 0 - Object3D.center.x;
    Object3D.userData.obj.position.y = 0 - Object3D.center.y;

    const edge = window.tb.Object3D({ obj: line });

    edge.setTranslate(center);

    edge.userData.properties = unit.properties;
    edge.userData.obj.position.x = 0 - edge.center.x;
    edge.userData.obj.position.y = 0 - edge.center.y;

    window.tb.add(edge);
    window.tb.add(Object3D);
  });
}

export function customBuildingsLayer(geoJson) {
  return {
    id: "3d-model",
    type: "custom",
    renderingMode: "3d",
    onAdd: function (map: Map, mbxContext: MapContextEvent) {
      window.tb = new threeBox.Threebox(map, mbxContext, threeBoxSettings);
      window.tb.features_selected = [];
      addCustomBuildings(geoJson.features);
    },
    render: function () {
      window.tb.update();
    },
  };
}
