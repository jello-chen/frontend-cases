const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MPromise {
    #state = PENDING;
    #result = undefined;
    #handlers = [];

    constructor(executor) {
        const resolve = data => {
            this.#transformState(FULFILLED, data);
        };
        const reject = error => {
            this.#transformState(REJECTED, error);
        };
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        return new MPromise((resolve, reject) => {
            this.#handlers.push({
                onFulfilled,
                onRejected,
                resolve,
                reject
            });
        });
    }

    #transformState(state, result) {
        if (this.#state !== PENDING) return;
        this.#state = state;
        this.#result = result;
        this.#handle();
    }

    #handle() {
        if (this.#state === PENDING) return;
        while (this.#handlers.length) {
            const {onFulfilled, onRejected, resolve, reject} = this.#handlers.shift();
            if (this.#state === FULFILLED) {
                this.#handleOne(onFulfilled, resolve, reject);
            } else if (this.#state === REJECTED) {
                this.#handleOne(onRejected, resolve, reject);
            }
        }
    }

    #handleOne(callback, resolve, reject) {
        if (typeof callback === 'function') {
            try {
                const data = callback(this.#result);
                if (data instanceof MPromise) {
                    data.then(resolve, reject);
                } else {
                    resolve(data);
                }
            } catch (err) {
                reject(err);
            }
        } else {
            const action = this.#state === FULFILLED ? resolve : reject;
            action(this.#result);
        }
    }

    toString() {
        return `MPromise ${this.#state} ${this.#result}`;
    }
}

module.exports = MPromise;