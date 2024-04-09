import gsap from "gsap";
import { Car } from "../car";

const colorsWrapper = document.querySelector(`.colors-section`) as HTMLElement;

export class ColorsChangerController {
    readonly mainColors = [
        "rgb(30, 30, 30)",
        "rgb(200, 200, 200)",
        "rgb(200, 0, 0)",
        "rgb(200, 200, 0)",
        "rgb(0, 200, 0)",
    ];

    constructor(private _selectedCar: Car | null) {
        this.init();
        this.setColorsSectionVisibility(false);
    }

    set setSelectedCar(car: Car | null) {
        this._selectedCar = car;
    }

    private init() {
        for (const color of this.mainColors) {
            const newColorBtn = document.createElement("button");
            newColorBtn.classList.add("color-grid");
            newColorBtn.style.backgroundColor = color;
            newColorBtn.dataset.color = color;
            newColorBtn.addEventListener("click", () => {
                this.colorCar(color);
            });
            colorsWrapper?.appendChild(newColorBtn);
        }
        this.setColorPicker();
        this.setTexturePicker();
    }

    private setColorPicker() {
        const colorPickerBtn = document.createElement("button");
        colorPickerBtn.classList.add("color-grid");
        colorPickerBtn.style.display = "flex";
        colorPickerBtn.style.justifyContent = "center";
        colorPickerBtn.style.alignItems = "center";
        colorPickerBtn.style.background =
            "linear-gradient(45deg, rgba(228,255,0,1) 0%, rgba(202,0,255,1) 18%, rgba(0,138,255,1) 36%, rgba(0,255,134,1) 57%, rgba(100,255,0,1) 78%, rgba(255,0,0,1) 100%)";

        const inputColor = document.createElement("input");
        inputColor.type = "color";
        inputColor.style.width = "0px";
        inputColor.style.opacity = "0";
        inputColor.style.pointerEvents = "none";
        inputColor.addEventListener("input", (event: any) => {
            this.colorCar(event.target.value);
        });

        const iconEle = document.createElement("i");
        iconEle.classList.add("fa-solid");
        iconEle.classList.add("fa-eye-dropper");
        colorPickerBtn.appendChild(iconEle);

        colorPickerBtn.appendChild(inputColor);

        colorPickerBtn.addEventListener("click", () => {
            inputColor.click();
        });
        colorsWrapper?.appendChild(colorPickerBtn);
    }

    private setTexturePicker() {
        const texturePickerBtn = document.createElement("button");
        texturePickerBtn.classList.add("color-grid");
        texturePickerBtn.style.display = "flex";
        texturePickerBtn.style.justifyContent = "center";
        texturePickerBtn.style.alignItems = "center";
        texturePickerBtn.style.background =
            "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)";

        const inputTexture = document.createElement("input");
        inputTexture.type = "file";
        inputTexture.style.width = "0px";
        inputTexture.style.opacity = "0";
        inputTexture.style.pointerEvents = "none";
        inputTexture.addEventListener("change", (event) =>
            this.handleTextureInput(event)
        );
        texturePickerBtn.appendChild(inputTexture);

        const iconEle = document.createElement("i");
        iconEle.classList.add("fa-regular");
        iconEle.classList.add("fa-note-sticky");
        texturePickerBtn.appendChild(iconEle);

        texturePickerBtn.addEventListener("click", () => {
            inputTexture.click();
        });
        colorsWrapper?.appendChild(texturePickerBtn);
    }

    private handleTextureInput(event: any) {
        const files = event.target.files;
        if (!files.length) return;

        const file = files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            if (!this._selectedCar) return;

            this._selectedCar.setColorTexture(event.target?.result);
        };

        reader.readAsDataURL(file);
    }

    private colorCar(color: string) {
        if (!this._selectedCar) return;

        this._selectedCar.setColorCar(color);
    }

    setColorsSectionVisibility(show: boolean) {
        if (show) {
            colorsWrapper.classList.remove('d-none')
            gsap.fromTo(colorsWrapper, {
                y: -100,
                x: '-50%',
                duration: 3
            }, {y: 0, x: '-50%'})
        } else {
            gsap.fromTo(colorsWrapper, {
                y: 0,
                x: '-50%',
                duration: 3
            }, {y: -100, x: '-50%'})
        }
    }
}