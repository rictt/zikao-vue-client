import Clipboard from "clipboard"
/**
 * @description 复制到剪切板
 * @param {Object} options 配置项
 */
export function copyText2Clipboard({ copyText = '', onSuccess = null, onError = null }) {
  console.log('handleCopy2', copyText);
  const targetEle = document.createElement('span');
  targetEle.setAttribute('id', 'copy-target-ele');
  // 设置复制内容
  targetEle.setAttribute('data-clipboard-text', copyText);
  // 元素插入到body中
  targetEle.style.cssText = 'opacity: 0; position: absolute; left: -3000px;';
  document.body.appendChild(targetEle)

  targetEle.addEventListener('click', (event) => {
    copyText2Clip(event)
  });
  targetEle.click()

  // 销毁元素
  function removeCopyTargetEle() {
    document.body.removeChild(targetEle)
  }
  function copyText2Clip(event) {
    const clipboard = new Clipboard(event.target)
    // //复制成功
    clipboard.on('success', res => {
      clipboard.destroy();  //及时销毁
      removeCopyTargetEle()
      if (onSuccess) {
        onSuccess()
      }
    })
    //复制失败，不支持复制
    clipboard.on('error', res => {
      clipboard.destroy()
      removeCopyTargetEle()
      if (onError) {
        onError()
      }
    })
    clipboard.onClick(event)  //解决第一次不触发问题
  }
}

