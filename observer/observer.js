export class EventEmitter {
    #subscribers = {}

    subscribe(eventName, callback) {
        if (!this.#subscribers[eventName]) {
            this.#subscribers[eventName] = []
        }
        this.#subscribers[eventName].push(callback)
    }

    unsubscribe(eventName, callback) {
        this.#subscribers[eventName] = this.#subscribers[eventName].filter(subscriber => subscriber !== callback)
    }

    emit(eventName, data = null) {
        // console.log(`Emitting eventName: ${eventName}`)
        this.#subscribers[eventName]?.forEach(subscriber => subscriber(data))
    }
}