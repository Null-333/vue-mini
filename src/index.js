class Vue {
    constructor(options) {
        // 通过属性保存选项的数据
        this.$options = options;
        this.$data = options.data;
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
        // 把data中的成员转换成getter和setter，并且注入到vue实例中
        this._proxyData(this.$data);
        // 调用observer对象，监听数据变化，将$data中的数据转换成getter，setter
        new Observer(this.$data);
        new Compiler(this);
    }

    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newVaule) {
                    if (newVaule === data[key]) {
                        return;
                    }
                    data[key] = newVaule;
                }
            })
        })
    }
}