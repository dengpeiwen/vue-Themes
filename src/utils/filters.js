// 导入工具包.时间函数
import {dateFormat} from  './common.js'

/**
 * 全部转小写
 * @param value 传入字符串 {String} DPW
 * @returns {string} dpw
 */
const lower = value => value.toLowerCase();


/**
 * 全部转大写
 * @param value 传入字符串 {String} dpw
 * @returns {string} DPW
 */
const upper = value => value.toUpperCase();

/**
 * 首字母大写
 * @param value 传入字符串 {String} dpw
 * @returns {string} Dpw
 */
const capitalize = value => {
    if (!value) return "";
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1)
}

// 根据本地时间把 Date 对象的时间部分转换为字符串
/**
 * 根据本地时间把时间戳部分转换为字符串
 * @param timestamp 传入时间戳 new Date().getTime() {num}
 * @returns {string} 下午8:52:29
 */
const time = timestamp => {
    return new Date(timestamp).toLocaleTimeString();
};

/**
 * 缩略超过规定长度的字符串
 * @param text 传入字符串 {string}
 * @param size 传入可显示文字大小 {num}
 * @returns {*} 返回替换文字
 */
const ellipsisText = (text, size)=> {
    return (size > 0 && text.length > size) ? text.slice(0, size) + '...' : text;
};

/**
 * 保留小数
 * @param num 传入数字 {num}
 * @param digit 保留位数默认两位 {num}
 * @returns {string} 返回指定位数的小数
 */
const decimals = (num,digit=2) => {
    const NUM = Number(num);
    if (Object.is(NUM, NaN)) {
        return '--';
    }
    return NUM.toFixed(digit);
};

/**
 * 浮点小数转化百分比
 * @param num 传入浮点数 {float,num,string}
 * @returns {string}
 */
const percentNumber = num => {
    const NUM = Number(num);
    if (Object.is(NUM, NaN)) {
        return '--';
    } else {
        // 一个数转为百分比形式需要放大100倍，但是浮点数的计算可能导致精度丢失，因此需要先将原数按小数位数放大成整数再运算
        const numParts = NUM.toString().split('.');
        let bit = 0; // 小数的位数
        if (numParts.length > 1) { // 带小数部分
            bit = numParts[1].length;
        }
        return `${Math.round(NUM * Math.pow(10, bit)) / Math.pow(10, bit - 2)}%`; // 变为整数时要用到 Math.round()
    }
};

/**
 * 字符串循环复制
 * @param str 传入字符串
 * @param count 传入循环次数
 * @returns {string} 返回循环指定次数的字符串
 */
const repeatStr = (str, count) => {
    let text = '';
    for (let i = 0; i < count; i++) {
        text += str;
    }
    return text;
}

/**
 * 替换文字
 * @param str
 * @param AFindText
 * @param ARepText
 * @returns {void | string | *}
 */
const replaceAll = (str, AFindText, ARepText) =>{
   let raRegExp = new RegExp(AFindText, "g");
    return str.replace(raRegExp, ARepText);
};

const suspectTagClass = tag => {
    const map = {
        '重点嫌疑': 'suspect-tag-focus',
        '一般嫌疑': 'suspect-tag-normal',
        '无嫌疑': 'suspect-tag-none',
        '待观察': 'suspect-tag-observe',
        '未加标签': 'suspect-tag-undo'
    };
    return map[tag] || 'suspect-tag-undo';
}

const trackStatusName = code => {
    const obj = {
        '1': '已结束',
        '2': '续控申请中',
        '3': '申请中',
        '4': '移交申请中',
        '5': '未到期',
        '6': '已过期',
        '7': '临期提醒'
    };
    return obj[code] || '--';
};

export {
    lower,
    upper,
    time,
    capitalize,
    decimals,
    dateFormat,
    ellipsisText,
    percentNumber,
    repeatStr,
    replaceAll,
    suspectTagClass,
    trackStatusName
}


