import get from "lodash/get";
import * as THREE from "three";
import utils from "threebox-plugin/src/utils/utils";
import { feature, features } from "../interfaces";

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

// color s
const lineColor = 0x2a6487;
const primaryColor = 0x6fa9c7;
const secondaryColor = 0x2a6487;
const garyLight = 0xececec;
const garyDark = 0xd8d8d8;
const buildingsLayerColor = "#fff";

export function addCustomBuildings(
  features: features,
  featureSelected: feature,
) {
  let color = primaryColor;

  features.map((unit, i) => {
    color =
      unit.properties.id == featureSelected.id ? secondaryColor : primaryColor;
    const available = get(unit, "properties.available", false);

    if (!available) {
      color = garyLight;
    }

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

    if (unit.properties.id == featureSelected.id) {
      Object3D.name = "featureSelected_";
      Object3D.userData.properties.clicked = true;
    }

    window.tb.add(edge);
    window.tb.add(Object3D);
  });
}
