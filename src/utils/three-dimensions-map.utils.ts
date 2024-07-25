import get from "lodash/get";
import * as THREE from "three";
import utils from "threebox-plugin/src/utils/utils";
import threeBox from "threebox-plugin";
import { Map, MapContextEvent } from "mapbox-gl";
import { Vector3 } from "three";

// colors
const primaryColor = 0x6fa9c7;

const DECIMAL_PRECISION = 9;
const LINE_COLOR = 0x2a6487;

function projectAndConvertCoordinates(
  point: Vector3,
  initialPoint: Vector3,
): Vector3 {
  const pX = point.x || 0;
  const pY = point.y || 0;
  const pZ = point.z || 0;
  const projectedPoint = utils.projectToWorld([pX, pY, pZ]);
  const x = utils.toDecimal(
    projectedPoint.x - initialPoint.x,
    DECIMAL_PRECISION,
  );
  const y = utils.toDecimal(
    projectedPoint.y - initialPoint.y,
    DECIMAL_PRECISION,
  );
  const z = utils.toDecimal(
    projectedPoint.z - initialPoint.z,
    DECIMAL_PRECISION,
  );
  return new Vector3(x, y, z);
}

function createShapeFromCoordinates(coordinates: number[]): THREE.Shape {
  const shape = new THREE.Shape();
  for (let i = 0; i < coordinates.length; i += 2) {
    const x = coordinates[i];
    const y = coordinates[i + 1];
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  return shape;
}

export function generateMesh(coordinates: number[][][], color: number) {
  const points: number[] = [];

  const worldCoordinates = utils.projectToWorld([
    coordinates[0][0][0],
    coordinates[0][0][1],
    coordinates[0][0][2] || 0,
  ]);
  const initialPoint: Vector3 = new Vector3(
    worldCoordinates.x,
    worldCoordinates.y,
    worldCoordinates.z,
  );

  coordinates[0].forEach((point) => {
    const coordinate = new Vector3(point[0], point[1], point[2]);
    const vec = projectAndConvertCoordinates(coordinate, initialPoint);
    points.push(vec.x, vec.y, vec.z);
  });
  /*
  console.log(">>>", points);
  const positionAttribute = new THREE.Float32BufferAttribute(points, 3);
  const geometry = new THREE.BufferGeometry();
  console.log("positionAttribute", positionAttribute);
  geometry.setAttribute("position", positionAttribute);
  //geometry.computeVertexNormals();
   */
  const extrudeSettings = {
    depth: 10,
    bevelEnabled: false,
  };

  const shape = createShapeFromCoordinates(points);
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  const material = new THREE.MeshPhongMaterial({
    color,
    refractionRatio: 0.8,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);

  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: LINE_COLOR }),
  );

  return { mesh, line };
}

const threeBoxSettings = {
  defaultLights: true,
  enableSelectingFeatures: false, // change this to false to disable fill-extrusion features selection
  enableSelectingObjects: false, // change this to false to disable 3D objects selection
  enableDraggingObjects: true, // change this to false to disable 3D objects drag & move once selected
  enableRotatingObjects: true, // change this to false to disable 3D objects rotation once selected
  enableTooltips: false, // change this to false to disable default tooltips on fill-extrusion and 3D models
};

export function addCustomBuildings(features) {
  let color = primaryColor;
  features.forEach((feature) => {
    const coordinates = get(feature, "geometry.coordinates", []);
    const center = get(feature, "properties.center", [0, 0]);

    const { mesh, line } = generateMesh(coordinates, color);

    const Object3D = window.tb.Object3D({ obj: mesh });
    console.log(center, mesh);
    console.log(center);
    Object3D.setTranslate(center);

    Object3D.userData.obj.position.x = 0 - Object3D.center.x;
    Object3D.userData.obj.position.y = 0 - Object3D.center.y;

    const edge = window.tb.Object3D({ obj: line });

    edge.setTranslate(center);

    edge.userData.obj.position.x = 0 - edge.center.x;
    edge.userData.obj.position.y = 0 - edge.center.y;

    window.tb.add(edge);
    window.tb.add(Object3D);
  });
}

export function customBuildingsLayer(geoJSON) {
  return {
    id: "3d-model",
    type: "custom",
    renderingMode: "3d",
    onAdd: function (map: Map, mbxContext: MapContextEvent) {
      window.tb = new threeBox.Threebox(map, mbxContext, threeBoxSettings);
      window.tb.features_selected = [];
      addCustomBuildings(geoJSON.features);
    },
    render: function () {
      window.tb.update();
    },
  };
}

export function generateConeCoordinates(
  center: [number, number, number],
  radius: number,
  height: number,
  numPoints: number,
) {
  const coordinates = [];
  const [lon, lat, alt] = center;

  // Generate base circle points
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    const x = lon + radius * Math.cos(angle);
    const y = lat + radius * Math.sin(angle);
    coordinates.push([x, y, alt]);
  }
  // Add the apex of the cone
  coordinates.push([lon, lat, alt + height]);

  return coordinates;
}
