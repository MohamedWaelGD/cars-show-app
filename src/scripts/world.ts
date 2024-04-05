import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export class World {
    renderer!: THREE.WebGLRenderer;
    scene!: THREE.Scene;
    camera!: THREE.Camera;
    orbitCamera!: OrbitControls;

    backgroundColor: number | string = `rgb(${30}, ${30}, ${30})`;

    constructor() {
        this.setupWorld()
    }

    private setupWorld() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.backgroundColor);

        this.setupFog();
        this.setupCamera();
        this.setupGround();
        this.setupSceneLights();
        this.animate();
    }

    private setupFog() {
        const near = 4;
        const far = 30;
        const color = new THREE.Color(this.backgroundColor);
        this.scene.fog = new THREE.Fog(color, near, far);
    }

    private setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 6);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.orbitCamera = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitCamera.enableDamping = true;
        this.orbitCamera.dampingFactor = 0.25;
        this.orbitCamera.minDistance = 5;
        this.orbitCamera.maxDistance = 7;
        this.orbitCamera.maxPolarAngle = (Math.PI / 2) - 0.1;
        this.orbitCamera.update();
    }

    private setupGround() {
        const planeMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshStandardMaterial({
                color: "rgb(100, 100, 100)",
                side: THREE.DoubleSide,
            })
        );
        planeMesh.receiveShadow = true;
        planeMesh.rotation.x = Math.PI / 2;
        this.scene.add(planeMesh);
    }

    private setupSceneLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 3);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(
            "rgb(255, 255, 255)",
            2
        );
        directionalLight.position.set(-50, 50, -50);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    private animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
