export type Handler<E> = (event: E) => void;

export class EventDispatcher<E> {
    private handlers: Handler<E>[] = [];

    next(event: E) {
        for (let h of this.handlers) h(event);
    }

    subscribe(handler: Handler<E>) {
        this.handlers.push(handler);
    }
}
