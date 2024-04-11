import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { CarController, CarDetails } from "../car";
import { World } from "../world";
import { IScene } from "./scene";
import { Color, Euler, Fog, Mesh, PointLight, Vector3 } from "three";
import gsap from "gsap";

export class ScifiScene extends IScene {
    readonly carDetails: CarDetails = {
        name: "BMW M4 CSL 2023",
        modelPath: "/models/bmw_m4_csl_2023.glb",
        partColors: [
            "M4xNME_fender_L_M4xNME_Paint_0",
            "M4xNME_body_M4xNME_Paint_0",
        ],
        scale: new Vector3(1.2, 1.2, 1.2),
        rotation: new Euler(0, Math.PI / 2, 0),
    };

    private _scenePath: string = "/scenes/scifi-scene.gltf";

    constructor(protected _world: World) {
        super(_world);
    }

    async loadScene(): Promise<void> {
        const gltfLoader = new GLTFLoader();
        const loadedGltf = await gltfLoader.loadAsync(this._scenePath);
        this._sceneModel = loadedGltf.scene;
        this._sceneModel.rotateY(Math.PI / 2);
        this._sceneModel.scale.x *= 2;
        this._sceneModel.scale.z *= 2;
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
            new Vector3(0, 0, 0)
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
        const near = 2;
        const far = 45;
        const color = new Color("rgb(0, 170, 220)");
        this._world.scene.fog = new Fog(color, near, far);
        this._world.scene.background = new Color("rgb(0, 170, 220)");
    }

    private setupLights() {
        const light1 = new PointLight("rgb(255, 255, 255)", 50, 100, 1);
        light1.castShadow = true;
        light1.position.set(-15, 5, 0);
        this._world.scene.add(light1);

        const light2 = new PointLight("rgb(255, 255, 255)", 50, 100, 1);
        light2.castShadow = true;
        light2.position.set(0, 5, 0);
        this._world.scene.add(light2);

        const light3 = new PointLight("rgb(255, 255, 255)", 50, 100, 1);
        light3.castShadow = true;
        light3.position.set(15, 5, 0);
        this._world.scene.add(light3);

        this._objects.push(light1, light2, light3);
    }
}
