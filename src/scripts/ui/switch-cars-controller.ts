import { Vector3 } from "three";
import { EventDispatcher, Handler } from "../utilities/event-handler";
import { Car } from "../car";
import gsap from "gsap";

const leftArrowBtn = document.querySelector(
    `#left-car-switch`
) as HTMLButtonElement;
const rightArrowBtn = document.querySelector(
    `#right-car-switch`
) as HTMLButtonElement;
const selectBtn = document.querySelector(`.middle-select`) as HTMLButtonElement;
const unSelectBtn = document.querySelector(
    `#done-control`
) as HTMLButtonElement;
const modelsCarsSection = document.querySelector(
    "#models-names"
) as HTMLElement;
const selectCarOptionsSection = document.querySelector(
    `.select-section`
) as HTMLElement;

export class SwitchCarsController {
    private _currentIndex: number = 0;
    private _selectedIndex: number | undefined = 0;
    private _onSelectCar = new EventDispatcher<Car | null>();
    private _onViewCar = new EventDispatcher<Car>();

    constructor(private _cars: Car[]) {
        this.setupSelectButton();
        this.setupUnSelectButton();
        this.setupNamesForModels();
        this.setupArrows();
        this.checkButtonsStatusActive();
    }

    get viewedCar() {
        return this._cars[this._currentIndex];
    }

    get selectedCar() {
        if (!this._selectedIndex) return null;

        return this._cars[this._selectedIndex];
    }

    public onViewCar(e: Handler<Car>) {
        this._onViewCar.subscribe(e);
    }

    public onSelectCar(e: Handler<Car | null>) {
        this._onSelectCar.subscribe(e);
    }

    private setupSelectButton() {
        selectBtn.addEventListener("click", () => {
            this._selectedIndex = this._currentIndex;
            this._onSelectCar.next(this._cars[this._currentIndex]);
            gsap.to(leftArrowBtn, {
                x: -500,
                duration: 2,
            });
            gsap.to(rightArrowBtn, {
                x: 500,
                duration: 2,
            });
            gsap.to(selectBtn, {
                y: 500,
                duration: 2,
            });
            gsap.to(modelsCarsSection, {
                y: -200,
                duration: 1
            })
            selectCarOptionsSection.classList.remove('d-none');
            gsap.fromTo(
                selectCarOptionsSection,
                {
                    y: 500,
                    duration: 3,
                },
                {
                    y: 0,
                }
            );
        });
    }

    private setupUnSelectButton() {
        unSelectBtn.addEventListener("click", () => {
            gsap.to(leftArrowBtn, {
                x: 0,
                duration: 2,
            });
            gsap.to(rightArrowBtn, {
                x: 0,
                duration: 2,
            });
            gsap.to(selectBtn, {
                y: 0,
                duration: 2,
            });
            gsap.to(selectCarOptionsSection, {
                y: 500,
                duration: 2,
            });
            gsap.to(modelsCarsSection, {
                y: 0,
                duration: 1
            })
            this._selectedIndex = undefined;
            this._onSelectCar.next(null);
        });
    }

    private setupNamesForModels() {
        for (let i = 0; i < this._cars.length; i++) {
            const car = this._cars[i];
            const carLiEle = document.createElement("li");
            const carButtonEle = document.createElement("button");
            carButtonEle.innerHTML = car.carDetails.name;
            carButtonEle.addEventListener("click", () => {
                this.selectCarIndex(i);
            });
            carLiEle.appendChild(carButtonEle);
            modelsCarsSection?.appendChild(carLiEle);
        }
    }

    private setupArrows() {
        leftArrowBtn?.addEventListener("click", () => {
            this.prevCar();
        });
        rightArrowBtn?.addEventListener("click", () => {
            this.nextCar();
        });
    }

    private selectCarIndex(index: number) {
        if (
            index < 0 ||
            index >= this._cars.length ||
            this._currentIndex === index
        )
            return;

        this._currentIndex = index;
        this._onViewCar.next(this._cars[this._currentIndex]);
        this.checkButtonsStatusActive();
    }

    private prevCar() {
        if (this._currentIndex - 1 < 0) return;

        this._currentIndex -= 1;
        this._onViewCar.next(this._cars[this._currentIndex]);
        this.checkButtonsStatusActive();
    }

    private nextCar() {
        if (this._currentIndex + 1 >= this._cars.length) return;
        this._currentIndex += 1;
        this._onViewCar.next(this._cars[this._currentIndex]);
        this.checkButtonsStatusActive();
    }

    private checkButtonsStatusActive() {
        if (this._currentIndex === 0) leftArrowBtn.disabled = true;
        else leftArrowBtn.disabled = false;
        if (this._currentIndex === this._cars.length - 1)
            rightArrowBtn.disabled = true;
        else rightArrowBtn.disabled = false;
    }
}
