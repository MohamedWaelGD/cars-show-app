import { Vector3 } from "three";
import { Car } from "../car";

export class SwitchCarsController {
    private _currentIndex: number = 0;
    private _leftArrowEle!: HTMLButtonElement;
    private _rightArrowEle!: HTMLButtonElement;

    constructor(
        private _cars: Car[],
        private _leftArrowId: string,
        private _rightArrowId: string,
        private _modelsCarsId: string
    ) {
        this.setupNamesForModels();
        this.setupArrows();
        this.checkButtonsStatusActive();
    }

    private setupNamesForModels() {
        const containerModelsEle = document.querySelector(
            `#${this._modelsCarsId}`
        );
        for (let i = 0; i < this._cars.length; i++) {
            const car = this._cars[i];
            const carLiEle = document.createElement("li");
            const carButtonEle = document.createElement("button");
            carButtonEle.innerHTML = car.name;
            carButtonEle.addEventListener("click", () => {
                this.selectCarIndex(i);
            });
            carLiEle.appendChild(carButtonEle);
            containerModelsEle?.appendChild(carLiEle);
        }
    }

    private setupArrows() {
        this._leftArrowEle = document.querySelector(
            `#${this._leftArrowId}`
        ) as HTMLButtonElement;
        this._rightArrowEle = document.querySelector(
            `#${this._rightArrowId}`
        ) as HTMLButtonElement;

        this._leftArrowEle?.addEventListener("click", () => {
            this.prevCar();
        });
        this._rightArrowEle?.addEventListener("click", () => {
            this.nextCar();
        });
    }

    private selectCarIndex(index: number) {
        if (index < 0 || index >= this._cars.length || this._currentIndex === index) return;

        this._currentIndex = index;
        for (let i = 0; i < this._cars.length; i++) {
            this._cars[i].moveCar(
                new Vector3((i - this._currentIndex) * 10, 0, 0)
            );
        }
        this.checkButtonsStatusActive();
    }

    private prevCar() {
        if (this._currentIndex - 1 < 0) return;

        this._currentIndex -= 1;

        for (let i = 0; i < this._cars.length; i++) {
            this._cars[i].moveCar(
                new Vector3((i - this._currentIndex) * 10, 0, 0)
            );
        }
        this.checkButtonsStatusActive();
    }

    private nextCar() {
        if (this._currentIndex + 1 >= this._cars.length) return;
        this._currentIndex += 1;
        for (let i = 0; i < this._cars.length; i++) {
            this._cars[i].moveCar(
                new Vector3((i - this._currentIndex) * 10, 0, 0)
            );
        }
        this.checkButtonsStatusActive();
    }

    private checkButtonsStatusActive() {
        if (this._currentIndex === 0) this._leftArrowEle.disabled = true;
        else this._leftArrowEle.disabled = false;
        if (this._currentIndex === this._cars.length - 1)
            this._rightArrowEle.disabled = true;
        else this._rightArrowEle.disabled = false;
    }
}
