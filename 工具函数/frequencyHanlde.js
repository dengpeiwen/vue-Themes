// 防抖
const debounce = (fn, time) => {
  let timeout = null;

  return function() {
    if(timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn, time);
  }
}

// 节流
const throttle = (fn, delay) => {
  let prev = Date.now();

  return function () {
    let context = this;
    let args = arguments;
    let now = Date.now();

    if (now - prev >= delay) {
      fn.apply(context, args);
      prev = Date.now();
    }
  }
}

export default {
  debounce,
  throttle
}
