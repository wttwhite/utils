# 地图相关

`npm i hsja-utils -D`

## WGS84转GCJ02

```javascript
import { wgs84togcj02 } from 'hsja-utils'
wgs84togcj02(120, 30)  // [120.00466044559735, 29.997534331696095]
```

## GCJ02转WGS84

```javascript
import { gcj02towgs84 } from 'hsja-utils'
gcj02towgs84(120, 30)  // [119.99533955440265, 30.002465668303905]
```

## BD09转GCJ02

百度坐标系 转 火星坐标系，即：

百度 转 谷歌、高德

```javascript
import { bd09togcj02 } from 'hsja-utils'
bd09togcj02(120,30)  // [119.9935908161529, 29.993662166054666]
```

## GCJ02转BD09

火星坐标系 转 百度坐标系，即：

谷歌、高德 转 百度

```javascript
import { gcj02tobd09 } from 'hsja-utils'
gcj02tobd09(120,30) // [120.00640999946, 30.006359999864998]
```
