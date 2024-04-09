import "./style.scss";
import { Euler, Vector3 } from "three";
import { Car, CarDetails } from "./scripts/car";
import { World } from "./scripts/world";
import { SwitchCarsController } from "./scripts/ui/switch-cars-controller";
import { ColorsChangerController } from "./scripts/ui/colors-changer-controller";
import { calculatePointsOnCircle } from "./scripts/utilities/circle";

const carDetails: CarDetails[] = [
    {
        name: 'Chevrolet Corvette C7',
        modelPath: '/models/chevrolet_corvette_c7.glb',
        partColors: ['CarBody_1_Car_Paint_0_1'],
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Euler(0, Math.PI / 2, 0)
    },
    {
        name: 'Loctus Elise',
        modelPath: '/models/loctus_elise.glb',
        partColors: ['LOTUS-def3Layer1_CARcarros_0'],
        scale: new Vector3(0.8, 0.8, 0.8),
        rotation: new Euler(0, -Math.PI / 2, 0)
    },
    {
        name: 'BMW M4 CSL 2023',
        modelPath: '/models/bmw_m4_csl_2023.glb',
        partColors: ['M4xNME_fender_L_M4xNME_Paint_0', 'M4xNME_body_M4xNME_Paint_0'],
        scale: new Vector3(1, 1, 1),
        rotation: new Euler(0, Math.PI / 2, 0)
    }
]

const world = new World();
const cars: Car[] = [];
const carPositions = calculatePointsOnCircle(0, 0, 20, carDetails.length);

let i = 0;
for (let carDetail of carDetails) {
    const car = new Car(carDetail, world.scene, world.camera, world.renderer, new Vector3(carPositions[i].x, carPositions[i].y, carPositions[i].z));
    car.partColorName = carDetail.partColors;
    await car.loadCar();
    cars.push(car);
    i += 1;
}

const switchCarsController = new SwitchCarsController(cars);
const colorsChangerController = new ColorsChangerController(switchCarsController.selectedCar!);
world.outFocusCamera(switchCarsController.viewedCar.model.position);

switchCarsController.onViewCar((car) => {
    world.outFocusCamera(car.model.position);
})

switchCarsController.onSelectCar((car) => {
    colorsChangerController.setSelectedCar = car;
    if (car) {
        world.focusCamera(car.model.position);
        colorsChangerController.setColorsSectionVisibility(true);
    } else {
        world.outFocusCamera(switchCarsController.viewedCar.model.position);
        colorsChangerController.setColorsSectionVisibility(false);
    }
});
