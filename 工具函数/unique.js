// 数组去重
const unique = (arr) => {
  if(!isArrayLink(arr)){ //不是类数组对象
    return arr
  }
  let result = []
  let objarr = []
  let obj = Object.create(null)

  arr.forEach(item => {
    if (isStatic(item)) { //是除了symbol外的原始数据
      let key = item + '_' + getRawType(item);
      if (!obj[key]) {
        obj[key] = true
        result.push(item)
      }
    }else {//引用类型及symbol
      if (!objarr.includes(item)) {
        objarr.push(item)
        result.push(item)
      }
    }
  })

  return result
};

export default {
  unique
}
