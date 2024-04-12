import "./style.scss";
import { World } from "./scripts/world";
import { SwitchCarsController } from "./scripts/ui/switch-cars-controller";
import { ColorsChangerController } from "./scripts/ui/colors-changer-controller";
import gsap from "gsap";
import { CarController, CarDetails } from "./scripts/car";
import { Euler, Vector3 } from "three";

const selectBtn = document.querySelector(
    ".middle-select"
)! as HTMLButtonElement;
const modelNamesWrapper = document.querySelector(
    ".models-selection"
)! as HTMLElement;
const leftArrowBtn = document.querySelector(
    "#left-car-switch"
)! as HTMLButtonElement;
const rightArrowBtn = document.querySelector(
    "#right-car-switch"
)! as HTMLButtonElement;
const carSelectionWrapper = document.querySelector(
    ".select-section"
)! as HTMLElement;
const colorSelectionWrapper = document.querySelector(
    ".colors-section"
)! as HTMLElement;
const finishEditCarBtn = document.querySelector(
    "#done-control"
)! as HTMLButtonElement;
let isCarSelected = false;
let isAnimating = false;
const world = new World();
const cars: CarController[] = [];
const carsDetails: CarDetails[] = [
    {
        name: "Chevrolet Corvette C7",
        modelPath: "/models/chevrolet_corvette_c7.glb",
        partColors: ["CarBody_1_Car_Paint_0_1"],
        scale: new Vector3(0.5, 0.5, 0.5),
        rotation: new Euler(0, Math.PI / 2, 0),
    },
    {
        name: "Loctus Elise",
        modelPath: "/models/loctus_elise.glb",
        partColors: ["LOTUS-def3Layer1_CARcarros_0"],
        scale: new Vector3(0.8, 0.8, 0.8),
        rotation: new Euler(0, -Math.PI / 2, 0),
    },
    {
        name: "BMW M4 CSL 2023",
        modelPath: "/models/bmw_m4_csl_2023.glb",
        partColors: [
            "M4xNME_fender_L_M4xNME_Paint_0",
            "M4xNME_body_M4xNME_Paint_0",
        ],
        scale: new Vector3(1, 1, 1),
        rotation: new Euler(0, Math.PI / 2, 0),
    },
];

const switchCarsController = new SwitchCarsController(carsDetails);
const colorsChangerController = new ColorsChangerController();
world.changeColor(colorsChangerController.selectedColor);

for (let i = 0; i < carsDetails.length; i++) {
    let newCar = new CarController(carsDetails[i], world);
    newCar.loadCar(() => {
        if (i !== switchCarsController.currentIndex) {
            newCar.model.visible = false;
        }

        newCar.setColorCar(colorsChangerController.selectedColor);
    });
    cars.push(newCar);
}

selectBtn.addEventListener("click", () => {
    if (isAnimating) return;
    isCarSelected = true;
    gsap.to(world.camera.position, {
        x: world.angleCameraPosition.x,
        y: world.angleCameraPosition.y,
        z: world.angleCameraPosition.z,
        duration: 2,
        ease: "power1.inOut"
    });
    checkUiAnimation();
});
finishEditCarBtn.addEventListener("click", () => {
    if (isAnimating) return;
    isCarSelected = false;
    world.setOrbitControlActive(false);
    gsap.to(world.camera.position, {
        x: world.sideCameraPosition.x,
        y: world.sideCameraPosition.y,
        z: world.sideCameraPosition.z,
        duration: 2,
        ease: "power1.inOut"
    });
    checkUiAnimation();
});
colorsChangerController.onSelectColor((color) => {
    world.changeColor(color);
    cars.forEach(e => {
        e.setColorCar(color);
    })
});
colorsChangerController.onSelectTexture((texture) => {
    cars.forEach(e => {
        e.setColorTexture(texture);
    })
});
switchCarsController.onSelect((switchIndex) => {
    if (isAnimating) return;
    const distance = 25;
    const durationPerAnimation = 3;

    const tl = gsap.timeline({
        onStart: () => {
            isAnimating = true;
            cars[switchIndex.current].model.position.x = -distance;
            cars[switchIndex.current].model.visible = true;
        },
        onComplete: () => {
            isAnimating = false;
        },
    });
    tl.add(
        gsap.to(cars[switchIndex.prev].model.position, {
            x: distance,
            ease: "circ.in",
            duration: durationPerAnimation,
            onComplete: () => {
                cars[switchIndex.prev].model.visible = false;
            },
        })
    );
    tl.add(
        gsap.to(world.camera.position, {
            x: 5,
            y: 5,
            z: 0,
            duration: 3,
            ease: "power1.inOut",
        }),
        `-=${durationPerAnimation}`
    );
    tl.add(
        gsap.to(cars[switchIndex.current].model.position, {
            ease: "circ.out",
            x: 0,
            duration: durationPerAnimation,
        })
    ),
        "-=3.5";
    tl.add(
        gsap.to(world.camera.position, {
            x: world.sideCameraPosition.x,
            y: world.sideCameraPosition.y,
            z: world.sideCameraPosition.z,
            duration: 3,
            ease: "power1.inOut",
        }),
        `-=2`
    );
    tl.play();
});

checkUiAnimation();

function checkUiAnimation() {
    if (isCarSelected) {
        const tl = gsap.timeline({
            onStart: () => {
                isAnimating = true;
            },
            onComplete: () => {
                isAnimating = false;
            },
        });
        tl.add(
            gsap.fromTo(
                selectBtn,
                {
                    y: 0,
                },
                {
                    y: 500,
                    duration: 1,
                }
            ),
            0
        );
        tl.add(
            gsap.fromTo(
                modelNamesWrapper,
                {
                    y: 0,
                },
                {
                    y: -500,
                    duration: 1,
                }
            ),
            0
        );
        tl.add(
            gsap.fromTo(
                leftArrowBtn,
                {
                    x: 0,
                },
                {
                    x: -500,
                    duration: 1,
                }
            ),
            0.35
        );
        tl.add(
            gsap.fromTo(
                rightArrowBtn,
                {
                    x: 0,
                },
                {
                    x: 500,
                    duration: 1,
                }
            ),
            0.45
        );
        carSelectionWrapper.classList.remove("d-none");
        tl.add(
            gsap.fromTo(
                carSelectionWrapper,
                {
                    y: 500,
                    duration: 1,
                },
                {
                    y: 0,
                }
            ),
            0.55
        );
        colorSelectionWrapper.classList.remove("d-none");
        tl.add(
            gsap.fromTo(
                colorSelectionWrapper,
                {
                    y: -500,
                    duration: 1,
                },
                {
                    y: 0,
                }
            ),
            0.55
        );
    } else {
        const tl = gsap.timeline({
            onStart: () => {
                isAnimating = true;
            },
            onComplete: () => {
                isAnimating = false;
            },
        });
        carSelectionWrapper.classList.remove("d-none");
        tl.add(
            gsap.fromTo(
                carSelectionWrapper,
                {
                    y: 0,
                    duration: 1,
                },
                {
                    y: 500,
                }
            ),
            0
        );
        colorSelectionWrapper.classList.remove("d-none");
        tl.add(
            gsap.fromTo(
                colorSelectionWrapper,
                {
                    y: 0,
                    duration: 1,
                },
                {
                    y: -500,
                }
            ),
            0
        );
        tl.add(
            gsap.fromTo(
                selectBtn,
                {
                    y: 500,
                },
                {
                    y: 0,
                    duration: 1,
                }
            ),
            0.15
        );
        tl.add(
            gsap.fromTo(
                modelNamesWrapper,
                {
                    y: -500,
                },
                {
                    y: 0,
                    duration: 1,
                }
            ),
            0.15
        );
        tl.add(
            gsap.fromTo(
                leftArrowBtn,
                {
                    x: -500,
                },
                {
                    x: 0,
                    duration: 1,
                }
            ),
            0.4
        );
        tl.add(
            gsap.fromTo(
                rightArrowBtn,
                {
                    x: 500,
                },
                {
                    x: 0,
                    duration: 1,
                }
            ),
            0.5
        );
    }
}

// async function initScene() {
//     await scenes[switchCarsController.currentIndex].loadScene();

//     colorsChangerController.selectedCar = scenes[switchCarsController.currentIndex].getCar();
//     switchCarsController.onSelect(async (index) => {
//         scenes[index.prev].leaveCar();
//         await delay(3000);

//         scenes[index.prev].destroyScene();
//         await scenes[index.current].loadScene();
//         colorsChangerController.selectedCar = scenes[index.current].getCar();
//     });
// }

// switchCarsController.onSelectCar((car) => {
//     colorsChangerController.setSelectedCar = car;
//     if (car) {
//         world.focusCamera(car.model.position);
//         colorsChangerController.setColorsSectionVisibility(true);
//     } else {
//         world.outFocusCamera(switchCarsController.viewedCar.model.position);
//         colorsChangerController.setColorsSectionVisibility(false);
//     }
// });
