import { Vector3 } from "three";
import { Car } from "./scripts/car";
import { World } from "./scripts/world";
import "./style.scss";
import { SwitchCarsController } from "./scripts/ui/switch-cars-controller";

const world = new World();
const cars: Car[] = [];

const hummerCar = new Car("Hummer", "/models/hummer_low_poly.glb", world.scene);
await hummerCar.loadCar();

const bmwCar = new Car("BMW M4 CSL 2023", "/models/bmw_m4_csl_2023.glb", world.scene, new Vector3(10, 0, 0));
await bmwCar.loadCar();

cars.push(hummerCar);
cars.push(bmwCar);


const switchController = new SwitchCarsController(cars, 'left-car-switch', 'right-car-switch', 'models-names');