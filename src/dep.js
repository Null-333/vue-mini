class Dep {
    constructor() {
        this.subs = [];
    }
    addSub() {
        Dep.target && this.subs.push(Dep.target);
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update();
        });
    }
}