import addClass from './dom/add-class'
import hasClass from './dom/has-class'
import removeClass from './dom/remove-class'
import toggleClass from './dom/toggle-class'

import downloadFileByUrl from './file/download-file-byurl'
import downloadFile from './file/download-file'
import compressImg from './file/compress-img'
import decompression from './file/decompression'
import readBlobToSrc from './file/read-blob-to-src'

import debounce from './function/debounce'
import getOrigin from './function/get-origin'
import hideSensitiveText from './function/hide-sensitive-text'
import throttle from './function/throttle'
import checkIDStrict from './function/check-id-strict'

import gcj02towgs84 from './map/gcj02towgs84'
import wgs84togcj02 from './map/wgs84togcj02'
import bd09togcj02 from './map/bd09togcj02'
import gcj02tobd09 from './map/gcj02tobd09'

import regExp from './reg-exp/reg-exp'

import getWeather from './weather/index.js'

export {
  // dom
  addClass,
  hasClass,
  removeClass,
  toggleClass,
  // 文件
  downloadFileByUrl,
  downloadFile,
  compressImg,
  decompression,
  readBlobToSrc,
  // 函数
  debounce,
  getOrigin,
  hideSensitiveText,
  throttle,
  checkIDStrict,
  // 地图
  gcj02towgs84,
  wgs84togcj02,
  bd09togcj02,
  gcj02tobd09,
  // 正则
  regExp,
  // 天气
  getWeather,
}
