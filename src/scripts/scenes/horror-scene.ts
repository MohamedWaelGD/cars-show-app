import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { CarController, CarDetails } from "../car";
import { World } from "../world";
import { IScene } from "./scene";
import { Color, Euler, Fog, Mesh, PointLight, Vector3 } from "three";
import gsap from "gsap";

export class HorrorScene extends IScene {
    readonly carDetails: CarDetails = {
        name: "Chevrolet Corvette C7",
        modelPath: "/models/chevrolet_corvette_c7.glb",
        partColors: ["CarBody_1_Car_Paint_0_1"],
        scale: new Vector3(0.7, 0.7, 0.7),
        rotation: new Euler(0, Math.PI / 2, 0),
    };

    private _scenePath: string = "/scenes/horror-scene.gltf";

    constructor(protected _world: World) {
        super(_world);
    }

    async loadScene(): Promise<void> {
        const gltfLoader = new GLTFLoader();
        const loadedGltf = await gltfLoader.loadAsync(this._scenePath);
        this._sceneModel = loadedGltf.scene;
        this._sceneModel.receiveShadow = true;
        this._sceneModel.traverse((obj) => {
            if (obj instanceof Mesh) {
                obj.receiveShadow = true;
            }
        });

        this._world.scene.add(this._sceneModel);

        this.setupFog();
        this.setupLights();

        this._car = new CarController(
            this.carDetails,
            this._world,
            new Vector3(0, -0.1, 0)
        );
        await this._car.loadCar();

        gsap.fromTo(
            this._car.model.position,
            { x: -50 },
            { x: 0, duration: 5 }
        );
    }

    leaveCar(): void {
        gsap.fromTo(
            this._car.model.position,
            { x: 0 },
            { x: 50, duration: 5 }
        );
    }

    private setupFog() {
        const near = 3;
        const far = 35;
        const color = new Color("rgb(220, 35, 0)");
        this._world.scene.fog = new Fog(color, near, far);
        this._world.scene.background = new Color("rgb(220, 35, 0)");
    }

    private setupLights() {
        const redLight = new PointLight("#FF2424", 15, 100, 1);
        redLight.castShadow = true;
        redLight.position.set(10, 8, 0);
        this._world.scene.add(redLight);

        const lightOrange1 = new PointLight("#FF4B24", 8, 100, 1);
        lightOrange1.castShadow = true;
        lightOrange1.position.set(4, 8, 0);
        this._world.scene.add(lightOrange1);

        const lightOrange2 = new PointLight("#FF4B24", 8, 100, 1);
        lightOrange2.castShadow = true;
        lightOrange2.position.set(8, 8, 0);
        this._world.scene.add(lightOrange2);

        this._objects.push(redLight, lightOrange1, lightOrange2);
    }
}
