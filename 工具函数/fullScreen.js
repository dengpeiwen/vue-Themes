/**
 * 浏览器全屏
 * @params: {String} 不支持全屏时的提示语
*/
const toFullScreen = (str) => {
  let elem = document.body;
  elem.webkitRequestFullScreen
  ? elem.webkitRequestFullScreen()
  : elem.mozRequestFullScreen
  ? elem.mozRequestFullScreen()
  : elem.msRequestFullscreen
  ? elem.msRequestFullscreen()
  : elem.requestFullScreen
  ? elem.requestFullScreen()
  : alert(str);
};

/*
 * 退出全屏
 * @params: str 退出全屏失败时的提示语
*/
const exitFullScreen = (str) => {
  let elem = parent.document;
  elem.webkitCancelFullScreen
  ? elem.webkitCancelFullScreen()
  : elem.mozCancelFullScreen
  ? elem.mozCancelFullScreen()
  : elem.cancelFullScreen
  ? elem.cancelFullScreen()
  : elem.msExitFullscreen
  ? elem.msExitFullscreen()
  : elem.exitFullscreen
  ? elem.exitFullscreen()
  : alert(str);
};

export default {
  toFullScreen,
  exitFullScreen
}
