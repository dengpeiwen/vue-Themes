// 深拷贝
const deepCopy = (obj) => {
  if(obj.constructor === Object) {
    let result = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object') {
          result[key] = utils.deepCopy(obj[key]); //递归复制
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }
  if(obj.constructor === Array){
    return obj.map(item => item)
  }
}

export default {
  deepCopy
}
