import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export class Car {
    private _model!: THREE.Group<THREE.Object3DEventMap>;
    private _spotlights: THREE.SpotLight[] = [];

    get model() {
        return this._model;
    }

    constructor(
        private _modelPath: string,
        private _scene: THREE.Scene,
        private _position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
    ) {
        this.loadCar();
    }

    loadCar() {
        if (this._model) {
            this._scene.remove(this._model);
        }
        if (this._spotlights && this._spotlights.length > 0) {
            this._spotlights.forEach(spotLight => this._scene.remove(spotLight));
        }

        const loader = new GLTFLoader();
        loader.load(this._modelPath, (gltf) => {
            this._model = gltf.scene;

            this._model.position.x = this._position.x;
            this._model.position.y = this._position.y;
            this._model.position.z = this._position.z;
            this._model.scale.set(1, 1, 1);
            this._model.rotation.set(0, Math.PI / 2, 0);

            this._model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    if (child.name == 'Object_3') {
                        let mat = child.material as THREE.MeshStandardMaterial;
                        mat.color = new THREE.Color('rgb(0, 255, 0)');
                        child.material = mat;
                    }
                }
                child.receiveShadow = true;
                child.castShadow = true;
            });
            this._scene.add(this._model);
        });
    }

    addHeadlights(headlightTransform: { position: THREE.Vector3, targetPosition: THREE.Vector3 }[]) {
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
            this._scene.add(spotlight);
            
            const spotLightHelper = new THREE.SpotLightHelper(spotlight);
            this._scene.add(spotLightHelper);

            this._spotlights.push(spotlight);
        });
    }
}
