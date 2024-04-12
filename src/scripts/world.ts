import gsap from "gsap";
import * as THREE from "three";
import {
    EffectComposer,
    GTAOPass,
    OrbitControls,
    OutputPass,
    RenderPass,
    UnrealBloomPass,
} from "three/examples/jsm/Addons.js";

const orbitBtn = document.querySelector("#orbit-control") as HTMLButtonElement;
const dragNoteEle = document.querySelector("#drag-note") as HTMLElement;
const bodyEle = document.querySelector("body") as HTMLElement;

export class World {
    renderer!: THREE.WebGLRenderer;
    scene!: THREE.Scene;
    camera!: THREE.Camera;
    orbitCamera!: OrbitControls;
    targetCamera = new THREE.Vector3(0, 0, 0);
    gsapAction!: gsap.core.Tween;
    renderScene!: RenderPass;
    composer!: EffectComposer;
    colorFactor = 0.2;
    nearFog = 20;
    farFog = 40;
    backgroundColor = new THREE.Color(`rgb(${30}, ${30}, ${30})`);
    planes: THREE.Mesh[] = [];

    sideCameraPosition = new THREE.Vector3(0, 2, -10);
    angleCameraPosition = new THREE.Vector3(5, 2, -5);

    constructor() {
        this.createWorld();
        this.setupOrbitButton();
    }

    private createWorld() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMap.enabled = true;

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.scene.background = this.backgroundColor;

        this.createLights();
        this.createCamera();
        this.createFog();
        this.createGroundAndWall();
        this.createPostProcessing();
        this.animate();
    }

    private createGroundAndWall() {
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshStandardMaterial({
            color: this.backgroundColor,
            side: THREE.DoubleSide
        }));
        ground.rotation.set(Math.PI / 2, Math.PI, 0);
        ground.receiveShadow = true;
        this.scene.add(ground);

        const wall = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), new THREE.MeshStandardMaterial({
            color: this.backgroundColor,
            side: THREE.DoubleSide
        }));
        wall.position.set(0, 0, 5);
        wall.receiveShadow = true;
        this.scene.add(wall);
        this.planes.push(ground, wall);
    }

    private createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.copy(this.sideCameraPosition);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.orbitCamera = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        this.orbitCamera.enableDamping = true;
        this.orbitCamera.dampingFactor = 0.25;
        this.orbitCamera.maxPolarAngle = Math.PI / 2 - 0.1;
        this.orbitCamera.enabled = false;
    }

    private createPostProcessing() {
        this.renderScene = new RenderPass(this.scene, this.camera);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(this.renderScene);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.2,
            0.5,
            0.5
        );
        this.composer.addPass(bloomPass);

        const outputPass = new OutputPass();
        this.composer.addPass(outputPass);
    }

    private animate() {
        this.orbitCamera.update();
        this.renderer.render(this.scene, this.camera);
        this.composer.render();
        requestAnimationFrame(() => this.animate());
    }

    private setupOrbitButton() {
        orbitBtn.addEventListener("click", () => {
            this.setOrbitControlActive(!this.orbitCamera.enabled);
        });
    }

    private createLights() {
        const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 2);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight('rgb(255, 255, 255)', 2);
        directionalLight.castShadow = true;
        directionalLight.position.set(-200, 200, -100);
        this.scene.add(directionalLight);
    }

    private createFog() {
        this.scene.fog = new THREE.Fog(this.backgroundColor, this.nearFog, this.farFog);
    }

    changeColor(newColorStr: string) {
        const color = new THREE.Color(newColorStr);
        gsap.to(this.backgroundColor, {
            r: color.r * this.colorFactor,
            g: color.g * this.colorFactor,
            b: color.b * this.colorFactor,
            onUpdate: () => {
                this.scene.background = this.backgroundColor;
                this.scene.fog = new THREE.Fog(this.backgroundColor, this.nearFog, this.farFog);
                this.planes.forEach(e => {
                    const material = new THREE.MeshStandardMaterial({
                        color: this.backgroundColor,
                        side: THREE.DoubleSide
                    });
                    e.material = material;
                    e.receiveShadow = true;
                });
            }
        });
    }

    setOrbitControlActive(value: boolean) {
        this.orbitCamera.enabled = value;
        if (value) {
            dragNoteEle.style.display = "block";
            bodyEle.style.cursor = "move";
        } else {
            dragNoteEle.style.display = "none";
            bodyEle.style.cursor = "default";
        }
    }

    focusCameraOnPoint(lookPoint: THREE.Vector3) {
        if (this.gsapAction) this.gsapAction.pause();
        const focusPoint = new THREE.Vector3(
            lookPoint.x,
            lookPoint.y,
            lookPoint.z
        );
        this.gsapAction = gsap.to(this.camera.position, {
            x: focusPoint.x,
            y: focusPoint.y,
            z: focusPoint.z,
            duration: 2,
            onUpdate: () => {
                this.lerpTargetCameraPoint(lookPoint);
            },
            onComplete: () => {
                this.lerpTargetCameraPoint(lookPoint, 1);
            },
        });
    }

    private lerpTargetCameraPoint(
        newPosition: THREE.Vector3,
        lerp: number = 0.05
    ) {
        this.targetCamera.lerp(newPosition, lerp);
        this.camera.lookAt(this.targetCamera);
        this.orbitCamera.target = this.targetCamera;
    }
}
