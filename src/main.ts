import { Vector3 } from "three";
import { Car } from "./scripts/car";
import { World } from "./scripts/world";
import "./style.scss";

const world = new World();

const car = new Car("/models/hummer_low_poly.glb", world.scene);

car.addHeadlights([
    { position: new Vector3(2.6, 1.1, 0.6), targetPosition: new Vector3(3, 1.1, 0.6) },
    { position: new Vector3(2.6, 1.1, -0.6), targetPosition: new Vector3(3, 1.1, -0.6) },
]);
