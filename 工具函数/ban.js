// 禁止右键 复制 选择
const ban = () => {
  ['contextmenu', 'selectstart', 'copy'].forEach(function(ev){
    document.addEventListener(ev, function(event){
      return event.returnValue = false
    })
  })
}

export default {
  ban
}
