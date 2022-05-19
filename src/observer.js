class Observer {
    constructor(data) {
        this.walk(data);
    }
    walk(data) {
        // 1. 判断data是否是对象
        if (!data || typeof data !== 'object') {
            return;
        }
        // 2. 遍历data对象的所有属性
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key]);
        })
    }
    defineReactive(data, key, val) {
        const that = this;
        // 负责收集依赖，并发送通知
        const dep = new Dep();
        // 如果val是对象，把val内部的对象属性也变成getter和setter
        this.walk(val);
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                dep.addSub();
                return val;
            },
            set(newVal) {
                if (val === newVal) {
                    return;
                }
                val = newVal;
                that.walk(newVal);
                dep.notify();
            }
        })
    }
}