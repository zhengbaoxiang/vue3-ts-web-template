/*
 * @Date: 2023-07-14 14:13:44
 * @LastEditors: zbx
 * @LastEditTime: 2023-10-16 09:24:59
 * @descript: 文件描述
 */
import { EmojiList } from '@/utils/Emoji';
import Cookies from 'js-cookie';

export const TOKEN_KEY = 'token'


export const getToken = () => {
  return Cookies.get(TOKEN_KEY) || '';
};
export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 1 });
};
export const clearToken = () => {
  Cookies.remove(TOKEN_KEY);
};


export const getLocal = (k: string) => {
  let v = localStorage.getItem(k)
  return (v && JSON.parse(v)) || ''
};

export const setLocal = (key: string, v: any) => {
  localStorage.setItem(key, JSON.stringify(v));
};


/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值位数只有1位，则在前面补充0
 */
function addZero(n: number | string) {
  n = n.toString();
  return n.length <= 1 ? '0' + n : n;
}
export const formatDate = (date: any, type = 'date'): string => {
  if (!date) {
    return null
  }
  let d = new Date(date);
  let year = d.getFullYear();
  let month = addZero(d.getMonth() + 1);
  let day = addZero(d.getDate());
  let hour = addZero(d.getHours());
  let minutes = addZero(d.getMinutes());
  let seconds = addZero(d.getSeconds());

  // 日期
  if (type === 'date') {
    return `${year}-${month}-${day}`;
    // 日期+时间
  } else if (type === 'dateTime') {
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
  } else if (type === 'millisecond') {
    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}.000`;
    // 月份
  } else if (type === 'month') {
    return `${year}-${month}`
    // 年份
  } else if (type === 'year') {
    return `${year}`;
    // 消息展示
  } else if (type === 'yyyy/mm/dd hh:mm:ss') {
    return `${year}/${month}/${day} ${hour}:${minutes}:${seconds}`;
  } else if (type === 'yyyy/mm/dd') {
    return `${year}/${month}/${day}`;
  } else if (type === 'mm/dd') {
    return `${month}/${day}`;
  } else if (type === 'mm/dd hh:mm:ss') {
    return `${month}月${day}日 ${hour}:${minutes}:${seconds}`;
  } else if (type === 'hh:mm:ss') {
    return `${hour}:${minutes}:${seconds}`;
  } else if (type === 'hh:mm') {
    return `${hour}:${minutes}`;
  }
}
export const formatChatTime = (dateTime: any, type: string = '') => {
  try {
    const myear = new Date(dateTime).getFullYear()
    const cYear = new Date().getFullYear()
    const today = new Date().setHours(0, 0, 0, 0)
    const yestoday = new Date(today - 24 * 3600 * 1000).getTime()
    if (dateTime > today) {
      return formatDate(dateTime, 'hh:mm:ss')
    } else if (dateTime > yestoday) {
      return '昨天' + formatDate(dateTime, 'hh:mm:ss')
    } else if (myear === cYear) {
      return formatDate(dateTime, 'mm/dd hh:mm:ss')
    } else {
      return formatDate(dateTime, 'yyyy/mm/dd hh:mm:ss')
    }
  } catch (error) {
    console.log('-error>', error)
    return ''
  }
}
// 根据时间戳，对话列表展示转换
/**  
 * 当天的：hh：mm
 * 昨天的：昨天
 * 当年非当天：mm-dd
 * 非当年：yyyy-mm-dd 
*/
export const formatTime = (dateTime: any, type: string = ''): string => {
  try {
    const myear = new Date(dateTime).getFullYear()
    const cYear = new Date().getFullYear()
    const today = new Date().setHours(0, 0, 0, 0)
    const yestoday = new Date(today - 24 * 3600 * 1000).getTime()
    if (dateTime > today) {
      return formatDate(dateTime, 'hh:mm')
    } else if (dateTime > yestoday) {
      return '昨天'
    } else if (myear === cYear) {
      return formatDate(dateTime, 'mm/dd')
    } else {
      return formatDate(dateTime, 'yy/mm/dd')
    }
  } catch (error) {
    console.log('-error>', error)
    return ''
  }
}

export const getAvator = (id: string, size: number = 360) => {
  return `https://avator.eastmoney.com/qface/${id}/${size}`
}
export const canTurnTo = (routeItem: any, vm: any) => {
  const resTitle = ''
  window.document.title = resTitle
}

export const setTitle = (routeItem: any, router: any) => {
  //简化处理，实际还要考虑嵌套，国际化等，现在没时间做
  const resTitle = routeItem.meta.locale || ''
  if (resTitle) window.document.title = resTitle

}

export const fileObjToStr = (fileObj: any, cb: Function) => {
  var file = fileObj
  var reader = new FileReader()
  reader.onloadend = function () {
    cb && cb(reader.result)
  }
  reader.readAsDataURL(file) // 读出 base64
}

export const copyText = (text: string) => {
  const input = document.createElement("input");
  document.body.appendChild(input);
  input.setAttribute("value", text);
  input.select();
  if (document.execCommand("copy")) {
    document.execCommand("copy");
    console.log("复制成功");
  }
  document.body.removeChild(input);
}

var emotionReg = /\[.+?\]/g

export function transferTxtToEmotion(str) {
  let emotionarr = str.match(emotionReg) || []
  //过滤重复表情，全局替换
  emotionarr = Array.from(new Set([...emotionarr]))

  for (let j = 0; j < emotionarr.length; j++) {
    for (var i = 0; i < EmojiList.length; i++) {
      if (emotionarr[j] === EmojiList[i].code) {
        //   str = str.replace(emotionarr[j], `<img src='./static/emotion_qq/${emotions[i].fileName}' class='emotion'>`)

        let reg = new RegExp('\\' + emotionarr[j].slice(0, emotionarr[j].length - 1) + '\\]', 'g')
        str = str.replace(reg, `<img src='${EmojiList[i].path}' class='emotion' data-code=${EmojiList[i].code}>`)
      }
    }
  }

  return str
}
export function filterimg(html) {
  const temp1 = html.replace(/(<img).*?(=">)/g, '')
  const result = temp1.replace(/(<img).*?(data-code=")/g, "");
  return result
}
export function filterfag(html) {
  let newStr = html
    .replace(/<\/?.+?>/g, "")
    // .replace(/ /g, "") //是否过滤空格
    .replace(/("style).*?(">)/g, "")
    .replace(/">/g, "")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
  return newStr.trim()
}


/**
 * 根据图片路径下载
 * @param imgsrc 图片路径
 * @param name 下载图片名称
 * @param type 格式图片，可选，默认png ，可选 png/jpeg
 */
export const downloadImgFromLink = (imgsrc: string) => {
  const name = imgsrc.split('/').pop()
  const type = name.split('.').pop()

  let image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");

  image.onload = function () {
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext("2d");

    context?.drawImage(image, 0, 0, image.width, image.height);

    let url = canvas.toDataURL(`image/${type}`); //得到图片的base64编码数据
    let a = document.createElement("a"); // 生成一个a元素
    let event = new MouseEvent("click"); // 创建一个单击事件
    a.download = name; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  }
  //将资源链接赋值过去，才能触发image.onload 事件
  image.src = imgsrc
}

/**
 * 创建 <a> 标签下载文件流格式图片
 * @param file 
 * @param fileName 
 */
export const downloadImgFile = (file: string, fileName?: string) => {
  const blob = new Blob([file]);
  const fileReader = new FileReader()

  fileReader.readAsDataURL(blob); // 将blob转为本地url
  fileReader.onload = (e) => {

    const aLink = document.createElement("a");
    aLink.download = fileName || '0123456.PNG';
    aLink.href = e.target?.result as string;
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);

  };
}

// 当图片地址是同源的，可以采用这种方式下载图片，
// 但是如果图片的地址是远端跨域的，点击下载效果也是在当前页面打开图片，
// 这种方式对于需要将远端图片下载到本地是无效的。
function downloadFromUrl(url, name) {
  const aLink = document.createElement('a')
  aLink.download = name
  aLink.href = url
  aLink.dispatchEvent(new MouseEvent('click', {}))
}


export const handleBLob = (res) => {
  let str = res.headers['content-disposition'] && res.headers['content-disposition'] || ''
  const reg = /filename=(.*?);/g
  var match = reg.exec(str)
  const tempStr = match[1] || ''

  const downloadName = decodeURIComponent(tempStr)
  let fileReader = new FileReader();
  fileReader.onload = function () {
    try {
      // 检查是否未普通json数据，后台转换失败给出的提示
      let jsonData = JSON.parse(this.result);
      console.log('jsonData', jsonData);
    } catch (err) {
      // 解析成对象失败，说明是正常的文件流
      // 其实res.data 本身就是blob对象 
      var blob = new Blob([res.data], {
        type: res.data.type
      });
      var downloadElement = document.createElement("a");
      var href = window.URL.createObjectURL(blob); //创建下载的链接
      downloadElement.href = href;
      downloadElement.download = downloadName; //下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(href); //释放掉blob对象
    }
  };
  // 读取
  fileReader.readAsText(res.data);

}


// 节流函数，减少高频调用，一段时间只触发一次
// 滚动监听，拖拽事件监听
export const throttle = () => {
  let timer: any = null
  return function (cb: Function, millseconds: number = 500) {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      cb()
      timer = null
    }, millseconds);
  }
}

// 防抖函数，减少多次调用，只触发最后一次
// 模糊搜索，表单验证，resize重绘
export const debounce = () => {
  let timer: any = null
  return function (cb: Function, millseconds: number = 500) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      cb()
      timer = null
    }, millseconds);

  }
}

export const accountTimer = debounce()
export const msgTimer = debounce()
