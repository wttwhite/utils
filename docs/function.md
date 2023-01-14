# 函数操作

下载依赖

`npm i custom-utils -D`

## debounce防抖

- @param{Function} func 需要防抖的函数
- @param{Number} wait 等待时间，默认16ms
- @param{Boolean} immediate 是否立即执行，默认false

```javascript
import { debounce } from 'custom-utils'
// 第一种方式
this.getDateList = debounce (this.getDateList, 5000)
// 第二种方式
getDateList: debounce (async function (page) {...}, 5000)
```

## throttle节流

- @param{Function} func 需要节流的函数
- @param{Number} wait 等待时间，默认16ms
- @param{Object} opts 配置项，默认{ noStart:false, noEnd:false }

```javascript
import { throttle } from 'custom-utils'
// 第一种方式
this.getDateList = throttle(this.getDateList, 5000)
// 第二种方式
getDateList: throttle(async function (page) {...}, 5000)
```

## 获取浏览器ip

获取当前浏览器ip+端口

@return{String}  ip+port

```javascript
import { getOrigin } from 'custom-utils'
getOrigin() // http://192.168.2.113:8081
```

## 文字脱敏

 隐藏敏感信息

- @param{String} str 需要处理的字符串
- @param{Number} start 替换的起始位置
- @param{Number} end 替换的截止位置
- @param{String} replaceStr 替换的字符串，默认*

@return 处理之后的字符串

```javascript
import { hideSensitiveText } from 'custom-utils'
hideSensitiveText('330480184578523698', 5, 14)  // 3304**********3698
```

## 严格的身份证校验

* @param{String} 身份证号
* @return{Boolean} 校验是否通过 false/true

```javascript
import { checkIDStrict } from 'custom-utils'
checkIDStrict('330480182512124755')  // false
```
