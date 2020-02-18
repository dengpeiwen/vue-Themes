// 格式化时间
const dateFormat = (date=new Date(), fmt='yyyy-MM-dd HH:mm:ss')=> {
  // 判断传入的date是时间对象还是时间戳
  let newDate = !date ? new Date() : (date instanceof Date) ? date : new Date(date);
  let dateList = {
      "M+": newDate.getMonth() + 1,
      "d+": newDate.getDate(),
      "H+": newDate.getHours(),
      "m+": newDate.getMinutes(),
      "s+": newDate.getSeconds(),
      "q+": Math.floor((newDate.getMonth() + 3) / 3),
      "S+": newDate.getMilliseconds()
  };
  if (/(y+)/i.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (newDate.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in dateList) {
      if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? dateList[k] : ("00" + dateList[k]).substr(("" + dateList[k]).length));
      }
  }
  return fmt;
}

const dayEnd = (date) => {
  let newDate = (date instanceof Date) ? date : new Date(date);
  if (newDate.toString() === "Invalid Date") {
    console.error('Invalid Date')
    return;
  } else {
    newDate.setHours(23, 59, 59, 0);
    return newDate
  }
}

export default {
  dateFormat,
  dayEnd
}
