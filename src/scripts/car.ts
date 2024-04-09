import { GLTFLoader, TransformControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import gsap from "gsap";

export class Car {
    private _model!: THREE.Group<THREE.Object3DEventMap>;
    private _spotlights: THREE.SpotLight[] = [];
    private _partsNames: string[] = [];

    constructor(
        private _carDetail: CarDetails,
        private _scene: THREE.Scene,
        private _camera: THREE.Camera,
        private _renderer: THREE.WebGLRenderer,
        private _position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
    ) {}

    get model() {
        return this._model;
    }

    get carDetails() {
        return this._carDetail;
    }

    set partColorName(newNames: string[]) {
        this._partsNames = [...newNames];
    }

    async loadCar() {
        if (this._model) {
            this._scene.remove(this._model);
        }
        if (this._spotlights && this._spotlights.length > 0) {
            this._spotlights.forEach((spotLight) =>
                this._scene.remove(spotLight)
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
        this._scene.add(this._model);

        const light = new THREE.PointLight(
            "rgb(255, 255, 255)",
            50,
            100,
            1
        );
        light.castShadow = true;
        light.position.set(this._position.x + 0, this._position.y + 4, this._position.z + 0);
        this._scene.add(light)
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
                mat.color = new THREE.Color(color);
                child.material = mat;
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