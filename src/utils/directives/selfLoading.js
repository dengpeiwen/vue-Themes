const createLoadingHTML = (status, text) => {
    const CLASS_NAME = `is-${status}`;
    const loadingMask = document.createElement('div');
    loadingMask.className = 'loading-mask';
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    loadingMask.append(loadingSpinner);
    const loadingIcon = document.createElement('div');
    loadingIcon.className = `loading-icon ${CLASS_NAME}`;
    const loadingText = document.createElement('div');
    loadingText.textContent = text;
    loadingText.className = `loading-text ${CLASS_NAME}`;
    loadingSpinner.append(loadingIcon);
    loadingSpinner.append(loadingText);
    return loadingMask;
};

const removeLoadingHTML = el => {
    const CLASS_NAME = 'loading-mask';
    // 遮罩层元素 loading-mask 通常会是指令元素内的最后一个子元素
    let node = el.lastChild;
    while (node) {
        if (node.classList && node.classList.contains(CLASS_NAME)) {
            node.parentNode.removeChild(node);
            break;
        } else {
            node = node.previousSibling;
        }
    }
}

const handleLoading = (el, { value, oldValue }, vnode) => {
    if (value !== oldValue) { // 只在指令绑定的值改变的情况下进行操作
        const POS = window.getComputedStyle(el, null).position;
        if (POS === '' || POS === 'static') {
            el.style.position = 'relative';
        }
        const showSuc = el.getAttribute('show-suc') || false,
            loadingText = el.getAttribute('loading-text') || '加载中',
            failedText = el.getAttribute('failed-text') || '加载失败，请稍后重试',
            sucText = el.getAttribute('suc-text') || '导入成功';

        removeLoadingHTML(el);
        switch (value) {
            case 'loading':
                el.append(createLoadingHTML(value, loadingText));
                break;
            case 'suc':
                if (showSuc) {
                    const maskElement = createLoadingHTML(value, sucText);
                    maskElement.addEventListener('click', e => {
                        removeLoadingHTML(el);
                    });
                    el.append(maskElement);
                    setTimeout(() => {
                        removeLoadingHTML(el);
                    }, 3000);
                }
                break;
            case 'failed':
                el.append(createLoadingHTML(value, failedText));

                // 如果定义了重新加载事件则增加按钮元素并绑定事件
                if (vnode.data.on && typeof vnode.data.on['on-refresh'] === 'function') { // 事件在 vnode.data.on 对象中
                    const btn = document.createElement('button');
                    btn.className = 'btn-white';
                    btn.innerHTML = '重新加载';
                    btn.style.marginTop = '20px';
                    btn.style.backgroundColor = 'transparent';
                    btn.addEventListener('click', vnode.data.on['on-refresh']);
                    el.querySelector('.loading-spinner').append(btn);
                }
                break;
        }
    }

}

export default {
    selfLoading: {
        inserted: handleLoading,
        update: handleLoading,
        unbind: function (el, binding) {
            removeLoadingHTML(el);
        }
    }
}

