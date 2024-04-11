import { Group, Object3D, Object3DEventMap } from "three";
import { CarController, CarDetails } from "../car";
import { World } from "../world";

export abstract class IScene {

    protected _sceneModel!: Group<Object3DEventMap>;
    protected _car!: CarController;
    protected _objects: Object3D[] = [];
    constructor(
        protected _world: World
    ) {}
    abstract carDetails: CarDetails;
    abstract loadScene(): Promise<void>;
    abstract leaveCar(): void;

    getCar(): CarController {
        return this._car;
    }

    destroyScene(): void {
        this._world.scene.remove(this._sceneModel);
        this._car.destroyCar();
        this._objects.forEach(e => this._world.scene.remove(e));
    };
}
