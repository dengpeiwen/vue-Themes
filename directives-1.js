import Vue from 'vue';
import BScroll from 'better-scroll';

/*
 * better-scroll 指令配置
 *
 * v-better-scroll="{ options: options, events: events, 'after-init': function(scrollObj) {} }"
 * 注意：BScroll 对象只会处理容器元素内的第一个元素的滚动，因此务必确保指令所在元素内有唯一的直接子元素（亦可包裹其他元素）
 *
 * @param options: { Object } 滚动条的各种配置，具体设置见 https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/options.html
 * @param events: { Object } 滚动条的各种触发事件，具体设置见 https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/events.html
 * @param after-init: { Function } 滚动条对象生成后的钩子函数，返回指令生成的 BetterScroll 对象
 */
Vue.directive('betterScroll', {
    inserted(el, binding) {
        // 必需的样式
        const El_POSITION = window.getComputedStyle(el).position; // getComputedStyle() 方法只有在 inserted 周期内才能获取到正确的样式
        if (!El_POSITION || El_POSITION === 'static') {
            el.style.position = 'relative';
        }
        el.style.overflow = 'hidden';

        // BScroll 对象只会处理容器元素内的第一个元素的滚动，超过一个时提示错误
        if (el.childNodes.length > 1) {
            console.error(new Error('The scroller can just operate the first immediate child element.'));
        }

        const options = {
            scrollbar: {
                fade: false,
                interactive: true
            },
            mouseWheel: true,
            // 以上部分为默认配置
            ...(binding.value && binding.value.options)
        },
            events = (binding.value && binding.value.events) || {};

        // 按配置初始化 BScroll 对象
        const scroll = new BScroll(el, options);

        // 在 BScroll 对象上依次设置事件
        for (let key in events) {
            if (events.hasOwnProperty(key)) {
                scroll.on(key, events[key]);
            }
        }

        Object.assign(el, { bScroll: scroll });

        // 把 BetterScroll 对象作为参数回传，使其能在页面中被使用
        if (binding.value && typeof binding.value['after-init'] === 'function') {
            binding.value['after-init'](scroll);
        }
    },
    componentUpdated(el) {
        el.bScroll.refresh();
    }
});

function createLoadingHTML(status, text) {
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
}
function removeLoadingHTML(el) {
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
function handleLoading(el, { value, oldValue }, vnode) {
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
/*
 * @Author: zhanghong
 * 加载中样式
 * @param v-self-loading {String} [必填] 加载状态 1、loading 2、suc 3、failed
 * @param show-suc {Boolean} [可选]  是否显示加载成功的状态 可用于指示文件上传成功
 * @param suc-text {String} [可选] 加载成功的文字提示 默认为“导入成功”
 * @param loading-text {String} [可选] 加载中的问题提示 默认为“加载中”
 * @param failed-text {String} [可选] 加载失败的问题提示 默认为“加载失败，请稍后重试”
 */
Vue.directive('self-loading', {
    inserted: handleLoading,
    update: handleLoading,
    unbind: function (el, binding) {
        // removeLoadingHTML(el);
    }
});

// /**
//  * 与上面的指令搭配使用 加载失败后显示重新加载按钮
//  * 为什么要再写一个指令 因为我不知道怎么在普通属性里面传函数………………
//  */
// Vue.directive('refresh-btn', function (el, binding) {
//     if (el.querySelector('.loading-spinner .loading-icon.is-failed')) {
//         let btn = document.createElement('button');
//         btn.className = 'btn-white';
//         btn.innerHTML = '重新加载';
//         btn.style.marginTop = '20px';
//         btn.style.backgroundColor = 'transparent';
//
//         btn.addEventListener('click', function (e) {
//             if (binding.expression) {
//                 binding.value(e);
//             }
//         });
//         el.querySelector('.loading-spinner').append(btn)
//     } else {
//         if (el.contains(el.getElementsByClassName('.btn-white')[0])) {
//             el.removeChild(el.getElementsByClassName('.btn-white')[0]);
//         }
//     }
// });

const insertTableRow = function (el, tdNum) {
    let tr = document.createElement('tr');
    tr.className = 'no-data';
    let td;
    for (let i = 0; i < tdNum; i += 1) {
        td = document.createElement('td');
        td.innerHTML = '-- --';
        if (i === (tdNum - 1)) {
            td.className = 'td-handle';
        }
        tr.append(td);
    }
    el.append(tr);
};
const removeNoDataRow = function (el) {
    if (el.contains(el.getElementsByClassName('no-data')[0])) {
        el.removeChild(el.getElementsByClassName('no-data')[0]);
    }
};

/*
 * @Author: zhanghong
 * 表格数据为空显示指令
 * @param show-none {Number} [必填] 总数据条数 为0时插入空tr 不为0时删除
 * @param length {Number} [必填] 一共有多少个td
 */
Vue.directive('show-none', function (el, binding) {
    const tdNum = parseInt(el.getAttribute('length')) || 1;
    removeNoDataRow(el);
    if (parseInt(binding.value) === 0) {
        insertTableRow(el, tdNum);
    } else {
        removeNoDataRow(el);
    }
});

Vue.directive('td-no-data', {
    bind: function (el, binding, vnode) {
        if (el.innerHTML === '') {
            el.innerHTML = '-- --';
        }
    },
    update: function (el, binding) {
        if (el.innerHTML === '') {
            el.innerHTML = '-- --';
        }
    },
    unbind: function (el, binding) { }
});




/*
 * 关键词高亮指令
 *
 * v-highlight-keyword="value"
 *
 * @param value: { String } 要高亮显示的关键词
 */
let key = Symbol('originalContent');
Vue.directive('highlightKeyword', {
    bind: function (el) {
        // 关键点：指令第一次绑定时把 innerHTML 的内容作为原始数据保存下来
        Object.assign(el, { [key]: el.innerHTML });
    },
    update: function (el, { value, oldValue }) {
        if (value !== oldValue && value && value.trim()) { // 关键词改变后才触发
            // 关键词高亮的方式是为关联词添加特定的 class，此操作会增加一个元素从而改变整个元素。
            // 为了防止过往操作的干扰，要使用保存的原始内容
            const CONTENT = el[key],
                REPLACE_CONTENT = `<i class="highlight-key">${value}</i>`;
            el.innerHTML = CONTENT.replace(new RegExp(value, 'g'), REPLACE_CONTENT);
        }
    }
});

/*
 * echarts 配置指令 @author zhongjf
 * echarts-render="{options: options}"
 */
Vue.directive('echartsRender', {
    inserted(el, binding) {
        const chart = echarts.init(el);
        el.chartoption = JSON.stringify(binding.value.options);
        chart.setOption(binding.value.options);
        window.addEventListener('resize', chart.resize);
    },
    update(el, binding) {
        if (JSON.stringify(binding.value.options) == el.chartoption) return;
        const oldChart = echarts.getInstanceByDom(el);
        if (oldChart) {
            window.removeEventListener('resize', oldChart.resize);
            oldChart.dispose();
        }
        const chart = echarts.init(el);
        chart.setOption(binding.value.options);
        el.chartoption = JSON.stringify(binding.value.options);
        window.addEventListener('resize', chart.resize);
    },
    unbind(el) {
        const oldChart = echarts.getInstanceByDom(el);
        if (oldChart) {
            window.removeEventListener('resize', oldChart.resize);
            oldChart.dispose();
        }
    }
});


/*
 * @Author: zhanghong
 * 聚焦指令
 */
Vue.directive('auto-focus', {
    inserted: function (el) {
        el.focus();
        el.setSelectionRange(0, -1);
        // 给el绑定一个全选的标志位
        // 当标志位为true的时候
        // 全选
        // 标志位不为true的时候
        // 不全选
        // 否则input框中的value一改变
        // 又会触发update事件
        // 全选输入框的值
        // 还是有bug 第二次打开不能全选
        el._selectAll = true;
    },
    update: function (el, binding) {
        if (binding.expression && binding.value) {
            el.focus();
            if (el._selectAll) {
                el.setSelectionRange(0, -1);
                el._selectAll = false;
            }
        }
    },
    unbind: function (el) {
        el.blur();
    }
});

/*
 * @Author: zhanghong
 * 点击除了绑定指令元素其他dom发生绑定的事件
 * 一般用于弹出层 点击其他地方隐藏弹出层
 *
 */
Vue.directive('click-other-place', {
    inserted: function (el, binding) {
        function clickHandler(e) {

            if (el.contains(e.target)) return;
            if (binding.expression) {
                binding.value(e);
            }
        }
        // 绑定一个变量用于解除绑定
        el._clickOtherPlace = clickHandler;
        document.addEventListener('click', clickHandler)
    },
    unbind: function (el) {
        document.removeEventListener('click', el._clickOtherPlace);
        delete el._clickOtherPlace;
    }
});

/*
 * @Author: zhanghong
 * 事件阻止冒泡(默认阻止得为点击事件 假如为点击事件 不用传值)
 * v-stop-propagation="wheel"
 * 多个事件用逗号分隔
 */
Vue.directive('stop-propagation', {
    inserted: function (el, binding) {
        let events;
        if (binding.value) {
            events = binding.value.split(',')
        } else {
            events = ['click'];
        }
        events.forEach(element => {
            el.addEventListener(element, function (e) {
                e.stopPropagation()
            })
        });
    }
});

Vue.directive('list-no-data', function(el, binding) {
    const ICON_CLASS_NAME = 'icon-list-empty';
    const MASK_CLASS_NAME = 'loading-mask';
    const text = el.getAttribute('show-text') || false;
    function insert(el) {
        if (el.style.position === '' || el.style.position === 'static') {
            el.style.position = 'relative';
        }
        let loadingMask = document.createElement('div');
        loadingMask.className = MASK_CLASS_NAME;
        let loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        const icon = document.createElement('i');
        icon.className = ICON_CLASS_NAME;
        loadingSpinner.append(icon);
        if (text) {
            let loadingText = document.createElement('div');
            loadingText.innerHTML = text;
            loadingText.className = 'loading-text';
            loadingSpinner.append(loadingText);
        }
        loadingMask.append(loadingSpinner);
        el.append(loadingMask);
    }

    function remove(el) {
        if (el.contains(el.getElementsByClassName(MASK_CLASS_NAME)[0])) {
            el.removeChild(el.getElementsByClassName(MASK_CLASS_NAME)[0]);
        }
    }
    if (parseInt(binding.value) === 0) {
        insert(el);
    } else {
        remove(el);
    }
});

Vue.directive('fill-table', function(el, binding) {
    let listLength = binding.value;
    let pageSize = el.getAttribute('page-size');
    let tdLength = el.getAttribute('td-length');
    try {
        if (listLength == undefined) throw '列表长度';
        if (pageSize == undefined) throw 'pageSize';
        if (tdLength == undefined) throw 'tdLength';
    } catch (err) {
        console.error( '没有绑定' + err)
    }
    const TR_CLASS_NAME = 'fill-table-tr';
    remove(el);
    // 这个假如不加settimeout 会执行顺序在渲染列表之前 会将空表格插入渲染的列表之前
    setTimeout(insert,0);
    function insert() {
        let diffNum = pageSize - listLength;
        if (diffNum === 0) return;
        for (let i = 0; i < diffNum; i += 1) {
            let tr = document.createElement('tr');
            tr.className = TR_CLASS_NAME;
            let td = document.createElement('td');
            td.setAttribute('colspan',tdLength);
            tr.append(td);
            el.append(tr);
        }
    }

    function remove(el) {
        let trLength = el.getElementsByClassName(TR_CLASS_NAME).length;
        if (trLength) {
            for (let  i= 0;  i< trLength;  i+= 1) {
                el.removeChild(el.getElementsByClassName(TR_CLASS_NAME)[0]);
            }
        }
    }
});
