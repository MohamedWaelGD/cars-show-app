import { Vector3 } from "three";
import { EventDispatcher, Handler } from "../utilities/event-handler";
import gsap from "gsap";
import { IScene } from "../scenes/scene";

const leftArrowBtn = document.querySelector(
    `#left-car-switch`
) as HTMLButtonElement;
const rightArrowBtn = document.querySelector(
    `#right-car-switch`
) as HTMLButtonElement;
const modelsCarsSection = document.querySelector(
    "#models-names"
) as HTMLElement;

export class SwitchCarsController {
    private _currentIndex: number = 0;
    private _onSelectIndex = new EventDispatcher<SwitchIndex>();

    constructor(private _scenes: IScene[]) {
        this.setupNamesForModels();
        this.setupArrows();
        this.checkButtonsStatusActive();
    }

    get currentIndex() {
        return this._currentIndex;
    }

    public onSelect(e: Handler<SwitchIndex>) {
        this._onSelectIndex.subscribe(e);
    }

    private setupNamesForModels() {
        for (let i = 0; i < this._scenes.length; i++) {
            const scene = this._scenes[i];
            const carLiEle = document.createElement("li");
            const carButtonEle = document.createElement("button");
            carButtonEle.innerHTML = scene.carDetails.name;
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
            index >= this._scenes.length ||
            this._currentIndex === index
        )
            return;

        this._onSelectIndex.next({
            prev: this._currentIndex,
            current: index,
        });
        this._currentIndex = index;
        this.checkButtonsStatusActive();
    }

    private prevCar() {
        if (this._currentIndex - 1 < 0) return;

        this._onSelectIndex.next({
            prev: this._currentIndex,
            current: this._currentIndex - 1,
        });
        this._currentIndex -= 1;
        this.checkButtonsStatusActive();
    }

    private nextCar() {
        if (this._currentIndex + 1 >= this._scenes.length) return;
        this._onSelectIndex.next({
            prev: this._currentIndex,
            current: this._currentIndex + 1,
        });
        this._currentIndex += 1;
        this.checkButtonsStatusActive();
    }

    private checkButtonsStatusActive() {
        if (this._currentIndex === 0) leftArrowBtn.disabled = true;
        else leftArrowBtn.disabled = false;
        if (this._currentIndex === this._scenes.length - 1)
            rightArrowBtn.disabled = true;
        else rightArrowBtn.disabled = false;
    }
}

export interface SwitchIndex {
    prev: number;
    current: number;
}
