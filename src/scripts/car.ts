import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import gsap from "gsap";
import { World } from "./world";

export class CarController {
    private _model!: THREE.Group<THREE.Object3DEventMap>;
    private _spotlights: THREE.SpotLight[] = [];
    private _partsNames: string[] = [];

    constructor(
        private _carDetail: CarDetails,
        private _world: World,
        private _position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
    ) {
        this.partColorName = _carDetail.partColors;
    }

    get model() {
        return this._model;
    }

    get carDetails() {
        return this._carDetail;
    }

    set partColorName(newNames: string[]) {
        this._partsNames = [...newNames];
    }

    async loadCar(onLoad: Function | null = null) {
        if (this._model) {
            this._world.scene.remove(this._model);
        }
        if (this._spotlights && this._spotlights.length > 0) {
            this._spotlights.forEach((spotLight) =>
                this._world.scene.remove(spotLight)
            );
        }

        const loader = new GLTFLoader();
        this._model = (await loader.loadAsync(this._carDetail.modelPath)).scene;
        this._model.position.x = this._position.x;
        this._model.position.y = this._position.y;
        this._model.position.z = this._position.z;
        this._model.scale.copy(this._carDetail.scale);
        this._model.rotation.copy(this._carDetail.rotation);

        this._model.traverse((child) => {
            child.castShadow = true;
        });
        this._world.scene.add(this._model);
        if (onLoad) {
            onLoad();
        }
    }

    destroyCar() {
        this._world.scene.remove(this._model);
    }

    addHeadlights(
        headlightTransform: {
            position: THREE.Vector3;
            targetPosition: THREE.Vector3;
        }[]
    ) {
        this._spotlights = [];

        headlightTransform.forEach((transform) => {
            const spotlight = new THREE.SpotLight(0xffffff, 5);
            spotlight.position.copy(transform.position);
            spotlight.target.position.copy(transform.targetPosition);
            spotlight.castShadow = true;
            spotlight.shadow.mapSize.width = 1024;
            spotlight.shadow.mapSize.height = 1024;
            spotlight.shadow.camera.near = 0.5;
            spotlight.shadow.camera.far = 500;
            this._model.add(spotlight);

            const spotLightHelper = new THREE.SpotLightHelper(spotlight);
            this._model.add(spotLightHelper);

            this._spotlights.push(spotlight);
        });
    }

    moveCar(newPosition: THREE.Vector3) {
        gsap.to(this._model.position, {
            duration: 2,
            x: newPosition.x,
            y: newPosition.y,
            z: newPosition.z,
        });
    }

    setColorCar(color: string) {
        if (!this._partsNames.length || !color) return;

        this._model.traverse((child) => {
            if (child instanceof THREE.Mesh && this._partsNames.includes(child.name)) {
                let mat = child.material as THREE.MeshStandardMaterial;
                let newColor = new THREE.Color(color);
                let oldColor = new THREE.Color(mat.color);
                gsap.to(oldColor, {
                    r: newColor.r,
                    g: newColor.g,
                    b: newColor.b,
                    onUpdate: () => {
                        mat.color = new THREE.Color(oldColor);
                        child.material = mat;
                    }
                });
            }
        });
    }

    setColorTexture(texture: any) {
        if (!this._partsNames.length || !texture) return;

        this._model.traverse((child) => {
            if (child instanceof THREE.Mesh && this._partsNames.includes(child.name)) {
                let mat = child.material as THREE.MeshStandardMaterial;
                const textureLoaded = new THREE.TextureLoader().load(texture);
                mat.map = textureLoaded;
                mat.needsUpdate = true;
                mat.color = new THREE.Color('rgb(255, 255, 255)');
                child.material = mat;
            }
        });
    }
}

export interface CarDetails {
    name: string,
    modelPath: string,
    partColors: string[],
    scale: THREE.Vector3,
    rotation: THREE.Euler,
}