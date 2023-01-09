import jszip from 'jszip';

const hasClass = (el, cls) => {
  if (!el || !cls || cls.indexOf(' ') !== -1) {
    return false;
  }
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return ` ${el.className} `.indexOf(` ${cls} `) > -1;
  }
};

const addClass = (el, cls) => {
  let curClass = el.className;
  const classes = (cls || '').split(' ');
  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) {
      continue;
    }
    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ` ${clsName}`;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

const removeClass = (el, cls) => {
  const classes = cls.split(' ');
  let curClass = ` ${el.className} `;
  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) {
      continue;
    }
    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(` ${clsName} `, ' ');
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

const toggleClass = (el, cls) => {
  if (hasClass(el, cls)) {
    removeClass(el, cls);
  } else {
    addClass(el, cls);
  }
};

//引入js文件代码
// 文件下载ppt,xls,word
function dowloadByUrl(str, fileName) {
  //   let that = this
  getBlob(str, function (blob) {
    saveAs(blob, fileName);
  });
  function getBlob(url, cb) {
    console.log('调用getBlob');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (xhr.status === 200) {
        cb(xhr.response);
      }
    };
    xhr.send();
  }
  function saveAs(blob, filename) {
    console.log('调用saveAs');
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      var link = document.createElement('a');
      var body = document.querySelector('body');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.style.display = 'none';
      body.appendChild(link);
      link.click();
      body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    }
  }
}

function downloadFile(res, fileName) {
  // 判断res的类型
  let liu = '';
  if (res instanceof Blob) {
    liu = res;
  } else if (res.data instanceof Blob) {
    liu = res.data;
  } else {
    console.error('res 和 res 都不是二进制码流');
    return;
  }
  const blob = new Blob([liu], {
    type: liu.type
  });
  let dom = document.createElement('a');
  //创建下载链接
  let url = window.URL.createObjectURL(blob);
  if (!fileName) {
    // 判断能否使用header的文件名
    if (!res.headers || !res.headers['content-disposition']) {
      console.error('res.headers没有值，请自己传入文件名');
      return;
    }
    fileName = res.headers['content-disposition'] ? res.headers['content-disposition'].split('attachment;filename=')[1] : new Date().getTime();
  }
  dom.href = url;
  // 解码
  dom.download = decodeURI(fileName);
  dom.style.display = 'none';
  document.body.appendChild(dom);
  dom.click();
  dom.parentNode.removeChild(dom);
  // 释放掉blob对象
  window.URL.revokeObjectURL(url);
}

/**
 * @description: 图片压缩
 */
function compressImg(file) {
  let scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
  let encoderOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [{
    key: '(-,1]',
    value: 1
  }, {
    key: '[1,2]',
    value: 0.92
  }, {
    key: '(2,+)',
    value: 0.5
  }];
  let disposeFile = file;
  if (Object.prototype.toString.call(file) === '[object Blob]') {
    disposeFile = new File([file], file.name, {
      type: file.type
    });
  }
  const fileSize = parseFloat(parseInt(disposeFile['size']) / 1024 / 1024).toFixed(2);
  const read = new FileReader();
  read.readAsDataURL(disposeFile);
  return new Promise((resolve, reject) => {
    try {
      read.onload = e => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = function () {
          // 获取压缩后的宽高
          const {
            width,
            height
          } = imgWidthHeight(this.width, this.height, scale, fileSize);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          ctx.drawImage(this, 0, 0, width, height);
          // 获取压缩质量之后的base64输出
          const base64 = encoderImg(disposeFile, canvas, encoderOptions, fileSize);
          resolve(dataURLtoFile(base64, disposeFile.name));
        };
      };
    } catch (error) {
      reject(disposeFile);
    }
  });
}
// 修改图片的宽高
function imgWidthHeight(w, h, scale, fileSize) {
  let width, height;
  try {
    if (typeof scale === 'number') {
      width = Math.floor(w * scale);
      height = Math.floor(h * scale);
    } else {
      scale.forEach(item => {
        formatOption(item.key, fileSize, () => {
          width = Math.floor(w * item.value);
          height = Math.floor(h * item.value);
        });
      });
    }
  } catch (error) {
    console.error('修改图片质量报错：', error);
  }
  return {
    width,
    height
  };
}
// 修改图片的质量, 输出base64
function encoderImg(disposeFile, canvas, encoderOptions, fileSize) {
  let base64;
  // type：图片格式，默认为 image/png,可以是其他image/jpeg等
  // encoderOptions：0到1之间的取值，主要用来选定图片的质量，默认值是0.92，超出范围也会选择默认值。
  // 注：格式为image/jpeg或webp的才会有质量压缩效果
  try {
    if (typeof encoderOptions === 'number') {
      base64 = canvas.toDataURL(disposeFile['type'], encoderOptions);
    } else {
      encoderOptions.forEach(item => {
        formatOption(item.key, fileSize, () => {
          base64 = canvas.toDataURL(disposeFile['type'], item.value);
        });
      });
    }
  } catch (error) {
    console.error('修改图片质量报错：', error);
  }
  console.log('base64', base64);
  return base64;
}
function formatOption(option, fileSize, cb) {
  const leftOperation = option.substring(0, 1);
  const rightOperation = option.substr(-1);
  const center = option.substr(1, option.length - 2);
  const arr = center.replace('，', ',').split(',');
  if (arr && arr.length === 2) {
    const left = leftOperation === '(' ? fileSize > arr[0] : fileSize >= arr[0];
    const right = rightOperation === ')' ? fileSize < arr[0] : fileSize <= arr[1];
    if (arr[0] === '-') {
      if (right) {
        cb();
      }
    } else if (arr[1] === '+') {
      if (left) {
        cb();
      }
    } else {
      if (left && right) {
        cb();
      }
    }
  } else {
    console.error('传参格式错误');
  }
}
/**
 * @description: 将base64编码转回file文件
 */
function dataURLtoFile(dataurl, fileName) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    // atob() 方法用于解码使用 base-64 编码的字符串。
    // base-64 编码使用方法是 btoa()
    bstr = window.atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, {
    type: mime
  });
}

function readBlobToSrc(blob) {
  const read = new FileReader();
  read.readAsDataURL(blob);
  return new Promise(resolve => {
    read.onload = e => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = e.target.result;
      resolve(img.src);
    };
  });
}

async function decompression(file, type) {
  const zip = new jszip();
  return zip.loadAsync(file.data).then(async res => {
    // 去掉数组的第一个值
    const keys = Object.keys(res.files);
    let list = [];
    console.log('keys', keys);
    keys.forEach(path => {
      if (path.substr(-1) !== '/') {
        list.push({
          path: path,
          value: res.files[path]
        });
      } else {
        delete res.files[path];
      }
    });
    // const base64 = await res.file('test-zip/daping.png').async('string')

    // const base64 = await res.file('test-zip/daping.png').asText()
    // const buffer = await res.file('test-zip/daping.png').asArrayBuffer()
    // return res.file()
    // let base64 = this.arrayBufferToBase64(buffer)
    // base64 = 'data:image/png;base64,' + base64
    // console.log(base64)
    if (!type) {
      return {
        files: res.files
      };
    } else {
      const data = await trySwitch(type, res, list);
      return {
        files: res.files,
        ...data
      };
    }
  });
}
async function trySwitch(type, res, list) {
  const dataArr = await Promise.all(list.map(item => {
    return res.file(item.path).async(type === 'img-bas64' ? 'blob' : type);
  }));
  const obj = {};
  list.forEach((item, index) => {
    obj[item.path] = dataArr[index];
    item.data = dataArr[index];
  });
  if (type === 'img-bas64') {
    const imgSrcArr = await Promise.all(list.map(item => {
      return readBlobToSrc(item.data);
    }));
    list.forEach((item, index) => {
      obj[item.path] = imgSrcArr[index];
    });
  }
  return Promise.resolve({
    files: res.files,
    transformObj: obj
  });
}

const debounce = function (func) {
  let wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
  let immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  let timeout, args, context, timestamp, result;
  const later = function () {
    const last = +new Date() - timestamp;
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };
  return function () {
    context = this;
    args = arguments;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
};

const getOrigin = () => {
  let _origin = '';
  if (!window.location.origin) {
    _origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  } else {
    _origin = window.location.origin;
  }
  return _origin;
};

/**
 * @description: 隐藏敏感信息
 * @param str 需要处理的字符串
 * @param start 替换的起始位置
 * @param end 替换的截止位置
 * @param replaceStr 替换的字符串
 * @return 处理之后的字符串
 */
const hideSensitiveText = function (str, start, end) {
  let replaceStr = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '*';
  const subStrArr = str.split('');
  return [...subStrArr.slice(0, start - 1), ...subStrArr.slice(start - 1, end).fill(replaceStr), ...subStrArr.slice(end)].join('');
};

const throttle = function (func) {
  let wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
  let opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    noStart: false,
    noEnd: false
  };
  let context, args, result;
  let timeout = null;
  let previous = 0;
  const later = function () {
    previous = opts.noStart ? 0 : +new Date();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) {
      context = args = null;
    }
  };
  return function () {
    const now = +new Date();
    if (!previous && opts.noStart) {
      previous = now;
    }
    const remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    } else if (!timeout && !opts.noEnd) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

// 复杂严格的身份证校验

function checkCode(val) {
  const p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  const code = val.substring(17);
  if (p.test(val)) {
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += val[i] * factor[i];
    }
    if (parity[sum % 11] == code.toUpperCase()) {
      return true;
    }
  }
  return false;
}
function checkDate(val) {
  const pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
  if (pattern.test(val)) {
    const year = val.substring(0, 4);
    const month = val.substring(4, 6);
    const date = val.substring(6, 8);
    const date2 = new Date(year + '-' + month + '-' + date);
    if (date2 && date2.getMonth() == parseInt(month) - 1) {
      return true;
    }
  }
  return false;
}
function checkProv(val) {
  const pattern = /^[1-9][0-9]/;
  const provs = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门'
  };
  if (pattern.test(val)) {
    if (provs[val]) {
      return true;
    }
  }
  return false;
}
function checkIDStrict(val) {
  if (checkCode(val)) {
    const date = val.substring(6, 14);
    if (checkDate(date)) {
      if (checkProv(val.substring(0, 2))) {
        return true;
      }
    }
  }
  return false;
}

const x_PI = 3.14159265358979324 * 3000.0 / 180.0;
const PI = 3.1415926535897932384626; //π
const a = 6378245.0; // 长半轴
const ee = 0.00669342162296594323; // 扁率

function transformlat(lng, lat) {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
  return ret;
}
function transformlng(lng, lat) {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
  return ret;
}

function gcj02towgs84(lng, lat) {
  // GCJ02(火星坐标系) 转GPS84: param lng: 火星坐标系的经度: param lat: 火星坐标系纬度: return :
  let dlat = transformlat(lng - 105.0, lat - 35.0);
  let dlng = transformlng(lng - 105.0, lat - 35.0);
  let radlat = lat / 180.0 * PI;
  let magic = Math.sin(radlat);
  magic = 1 - ee * magic * magic;
  let sqrtmagic = Math.sqrt(magic);
  dlat = dlat * 180.0 / (a * (1 - ee) / (magic * sqrtmagic) * PI);
  dlng = dlng * 180.0 / (a / sqrtmagic * Math.cos(radlat) * PI);
  let mglat = lat + dlat;
  let mglng = lng + dlng;
  return [lng * 2 - mglng, lat * 2 - mglat];
}

function wgs84togcj02(lng, lat) {
  let dlat = transformlat(lng - 105.0, lat - 35.0);
  let dlng = transformlng(lng - 105.0, lat - 35.0);
  let radlat = lat / 180.0 * PI;
  let magic = Math.sin(radlat);
  magic = 1 - ee * magic * magic;
  let sqrtmagic = Math.sqrt(magic);
  dlat = dlat * 180.0 / (a * (1 - ee) / (magic * sqrtmagic) * PI);
  dlng = dlng * 180.0 / (a / sqrtmagic * Math.cos(radlat) * PI);
  let mglat = lat + dlat;
  let mglng = lng + dlng;
  return [mglng, mglat];
}

function bd09togcj02(bd_lon, bd_lat) {
  const x = bd_lon - 0.0065;
  const y = bd_lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
  const gg_lng = z * Math.cos(theta);
  const gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat];
}

function gcj02tobd09(lng, lat) {
  const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
  const bd_lng = z * Math.cos(theta) + 0.0065;
  const bd_lat = z * Math.sin(theta) + 0.006;
  return [bd_lng, bd_lat];
}

var regExp = {
  /* eslint-disable no-useless-escape */
  // ip (127.0.0.1)
  ip: /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/,
  // port (0～65535)
  port: /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
  // email
  email: /(^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$)|(^$)/,
  // mac地址
  macAddr: /^([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2}$/,
  // 数字
  number: /^\d*$/,
  // 自然数 0 1 2 3 4
  naturalNum: /^(0|[1-9]\d*)$/,
  // 正整数 1 2 3 4
  positiveNum: /^[1-9]\d*$/,
  //  1～32个字符；不能包含 ' / \ : * ? " < > | 等特殊字符
  name: /^[^'\/\\:\*\?"<>\|]*$/,
  // 1-32个字符，只能用字母、数字、汉字、小数点、下划线、连接符、括号 「设备型号」
  deviceType: /^[a-zA-Z0-9\.\-_\(\)\u4E00-\u9FA5]*$/,
  // 字母、数字、汉字、小数点、下划线、连接符 [设备编码]
  deviceCode: /^[a-zA-Z0-9\.\-_\u4E00-\u9FA5#()\s]*$/,
  // 设备登录用户名 1～32个字符，只能用字母、数字、汉字、小数点、下划线、连接符。
  deviceUserName: /^[a-zA-Z0-9\.\-_\u4E00-\u9FA5]*$/,
  // 字母、数字的组合 「设备编号1-32位」
  numLetter: /^[\da-zA-Z]*$/,
  // 字母、数字、汉字的组合 「工号1-32」「入场播报」「出场播报」「放行播报」
  numLetterAndCN: /^[\da-zA-Z\u4E00-\u9FA5]*$/,
  // 字母、汉字的组合 「职位1-128」
  numAndCN: /^[a-zA-Z\u4E00-\u9FA5]*$/,
  // 字母、数字和除:\"之外的特殊字符 「设备账号1-32位」
  deviceAccount: /^[a-zA-Z0-9~`!@#\$%^&*()_+\-=\[\];',<.>/|?]{1,32}$/,
  // 车牌号
  licenseNumber: /^[^'\/\\:\*\?"<>\|]{1,16}$/,
  // 手机号
  phoneNum: /^\d{1,11}$/,
  // 姓名 1-128个数字、字母、汉字、间隔号（·）和空格
  personName: /^[\da-zA-Z\u4E00-\u9FA5· ]{1,128}$/,
  // 证件号码
  IDNumber: /^[0-9a-zA-Z]{0,20}$/,
  // 身份证号 18位，前17位为数字，尾号为数字或大写字母X。
  identityCard: /^\d{17}[\d|X]$/,
  // 密码为8-16位字符，至少由大写字母、小写字母、数字、特殊字符任意两种组成。
  password: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/,
  // 卡号 8-18个字符，只能用数字和大写字母。
  cardNum: /^[0-9A-Z]{8,18}$/,
  // 4-8位数字 「卡密码」「胁迫密码」「超级密码」
  simplePassword: /^\d{4,8}$/,
  // UUID 32位大写英文字母、数字、连接符。
  uuid: /^[a-zA-Z\d]{8}-[a-zA-Z\d]{4}-[a-zA-Z\d]{4}-[a-zA-Z\d]{4}-[a-zA-Z\d]{12}$/
};

/**
 嘉兴城市编码
 嘉兴市    330400
 嘉兴市市辖区    330401
 南湖区    330402
 秀洲区    330411
 嘉善县    330421
 海盐县    330424
 海宁市    330481
 平湖市    330482
 桐乡市    330483
 * */
/**
 * 调用高德天气接口 获取当前天气 https://lbs.amap.com/api/webservice/guide/api/weatherinfo
 * f9e1a05e3c9c043be842fdad9040a8a6
 * @param {String} cityCode 城市编码
 * @param {String} key 高德api调用key 目前用的是我个人的 实际项目中需要改成公司的
 * @param {String} extensions='base' 气象类型  base:返回实况天气 all:返回预报天气
 * @return {Object} 天气数据
 */
function getWeather() {
  let cityCode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '330400';
  let key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '442b97f4e1c843da3a75a18528868070';
  let extensions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'base';
  return new Promise((resolve, reject) => {
    if (!key) {
      console.error('缺少高德key');
      reject('缺少高德key');
      return;
    }
    if (!cityCode) {
      console.error('缺少城市编码');
      reject('缺少城市编码');
      return;
    }
    fetch(`https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=${key}&extensions=${extensions}`).then(res => res.json()).then(res => {
      const {
        infocode,
        info,
        count
      } = res;
      if (infocode === '10000') {
        if (count > 0) {
          if (extensions === 'base') {
            resolve(res.lives[0]);
          } else {
            resolve(res.forecasts[0]);
          }
        } else {
          reject('无数据');
        }
      } else {
        console.error(info);
        reject(info);
      }
    }).catch(err => {
      reject(err);
    });
  });
}

export { addClass, bd09togcj02, checkIDStrict, compressImg, debounce, decompression, downloadFile, dowloadByUrl as downloadFileByUrl, gcj02tobd09, gcj02towgs84, getOrigin, getWeather, hasClass, hideSensitiveText, readBlobToSrc, regExp, removeClass, throttle, toggleClass, wgs84togcj02 };
