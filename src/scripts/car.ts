import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import gsap from "gsap";

export class Car {
    private _model!: THREE.Group<THREE.Object3DEventMap>;
    private _spotlights: THREE.SpotLight[] = [];

    get model() {
        return this._model;
    }

    get name() {
        return this._name;
    }

    constructor(
        private _name: string,
        private _modelPath: string,
        private _scene: THREE.Scene,
        private _position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
        private _scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1)
    ) {}

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
        this._model = (await loader.loadAsync(this._modelPath)).scene;
        this._model.position.x = this._position.x;
        this._model.position.y = this._position.y;
        this._model.position.z = this._position.z;
        this._model.scale.copy(this._scale);
        this._model.rotation.set(0, Math.PI / 2, 0);

        this._model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                // if (child.name == "Object_3") {
                //     let mat = child.material as THREE.MeshStandardMaterial;
                //     mat.color = new THREE.Color("rgb(0, 255, 0)");
                //     child.material = mat;
                // }
            }
            child.receiveShadow = true;
            child.castShadow = true;
        });
        this._scene.add(this._model);
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
        gsap.to(this._model.position, { duration: 2, x: newPosition.x, y: newPosition.y, z: newPosition.z })
    }
}
