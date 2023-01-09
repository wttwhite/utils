import { PI, a, ee } from './const'
import { transformlat, transformlng } from './function'
export default function wgs84togcj02(lng, lat) {
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
  return [mglng, mglat]
}
