class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm;
        // data中的属性名
        this.key = key;
        // 回调函数负责更新视图
        this.cb = cb;
        // 把watcher对象记录到dep类的target
        Dep.target = this;
        // 触发get方法，在get方法中会调用addSub
        this.oldValue = vm[key];
        Dep.target = null;
    }
    update() {
        if (this.vm[this.key] === this.oldValue) {
            return;
        }
        this.oldValue = this.vm[this.key];
        this.cb(this.vm[this.key]);
    }
}