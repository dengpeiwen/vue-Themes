/**
 * 获取数据类型
 * @params: value 需要判断类型的值
 * @result: Number、String、Object、Array...
*/
const getDataType = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1)
};

// 判断数据是否为数组
const isArray = (arr) => {
  return Object.prototype.toString.call(arr) === '[object Array]'
};

// 判断数据是否为对象
const isObj = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
};

// 判断数据是否为函数
const isFunction = (fn) => {
  return Object.prototype.toString.call(value) === '[object Function]'
};

export default {
  getDataType,
  isArray,
  isObj,
  isFunction
}
