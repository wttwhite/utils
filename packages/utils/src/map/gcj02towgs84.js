import { PI, a, ee } from './const'
import { transformlat, transformlng } from './function'
export default function gcj02towgs84(lng, lat) {
  // GCJ02(火星坐标系) 转GPS84: param lng: 火星坐标系的经度: param lat: 火星坐标系纬度: return :
  let dlat = transformlat(lng - 105.0, lat - 35.0)
  let dlng = transformlng(lng - 105.0, lat - 35.0)
  let radlat = (lat / 180.0) * PI
  let magic = Math.sin(radlat)
  magic = 1 - ee * magic * magic
  let sqrtmagic = Math.sqrt(magic)
  dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI)
  dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI)
  let mglat = lat + dlat
  let mglng = lng + dlng
  return [lng * 2 - mglng, lat * 2 - mglat]
}
