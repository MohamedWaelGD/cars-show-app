import gsap from "gsap";
import * as THREE from "three";
import {
    EffectComposer,
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

    backgroundColor: number | string = `rgb(${30}, ${30}, ${30})`;

    constructor() {
        this.setupWorld();
        this.setupOrbitButton();
    }

    private setupWorld() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMap.enabled = true;

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.backgroundColor);

        this.setupCamera();
        this.setupPostProcessing();
        this.animate();
    }

    private setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(7, 5, 0);
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

    private setupPostProcessing() {
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

    focusCamera(lookPoint: THREE.Vector3) {
        if (this.gsapAction) this.gsapAction.pause();
        const focusPoint = new THREE.Vector3(
            lookPoint.x + 5,
            lookPoint.y + 4,
            lookPoint.z + -5
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

    outFocusCamera(lookPoint: THREE.Vector3) {
        if (this.gsapAction) this.gsapAction.pause();
        this.orbitCamera.enabled = false;
        dragNoteEle.style.display = "none";
        bodyEle.style.cursor = "default";
        const focusPoint = new THREE.Vector3(
            lookPoint.x + 7,
            lookPoint.y + 5,
            lookPoint.z + 7
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
