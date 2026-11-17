class PointStore {
    constructor(key = 'lab1_history') {
        this.key = key;
    }

    load() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    }

    add(point) {
        const history = this.load();
        history.push(point);
        localStorage.setItem(this.key, JSON.stringify(history));
    }

    clear() {
        localStorage.removeItem(this.key);
    }
}