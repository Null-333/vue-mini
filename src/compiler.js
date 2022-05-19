class Compiler {
    constructor(vm) {
        this.vm = vm;
        this.el = vm.$el;
        this.compile(this.el);
    }
    // 编译模板，处理元素节点和文本节点
    compile(el) {
        Array.from(el.childNodes).forEach(node => {
            if (this.isElementNode(node)) {
                this.compileElement(node);
            } else if (this.isTextNode(node)) {
                this.compileText(node);
            }
            // 判断node节点是否有子节点，如果有子节点，递归调用compile
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node);
            }
        })
    }
    // 编译元素节点，处理指令
    compileElement(node) {
        Array.from(node.attributes).forEach(attr => {
            if (this.isDirective(attr.name)) {
                const attrName = attr.name.substr(2);
                if (attrName.startsWith('on:')) {
                  const event = attrName.slice(3);
                  const key = attr.value;
                  this.bindEvent(node, event, key);
                } else {
                  const key = attr.value;
                  this.update(node, attrName, key);
                }
            }
        });
    }
    // 编译文本节点，处理插值表达式
    compileText(node) {
        // {{ msg }}
        const res = /\{\{(.+?)\}\}/;
        if (res.test(node.textContent)) {
            const key = RegExp.$1.trim();
            node.textContent = this.vm[key];
            // 创建watcher对象，当数据改变时更新视图
            new Watcher(this.vm, key, newValue => {
                node.textContent = newValue;
            });
        }
    }
    update(node, attrName, key) {
        const updateFn = this[`${attrName}Updater`];
        updateFn && updateFn.call(this, node, this.vm[key], key);
    }
    // v-on
    bindEvent(node, event, key) {
      node.addEventListener(event, this.vm[key]);
    }
    // v-text
    textUpdater(node, value, key) {
        node.textContent = value;
        new Watcher(this.vm, key, newValue => {
            node.textContent = newValue;
        });
    }
    // v-model
    modelUpdater(node, value, key) {
        node.value = value;
        new Watcher(this.vm, key, newValue => {
            node.value = newValue;
        });
        node.addEventListener('input', () => {
            this.vm[key] = node.value;
        });
    }
    // v-html
    htmlUpdater(node, value, key) {
      node.innerHTML = value;
      new Watcher(this.vm, key, newValue => {
        node.innerHTML = newValue;
      });
    }
    // 判断元素属性是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-');
    }
    // 判断是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3;
    }
    // 判断是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1;
    }
}
