import { x_PI } from './const'
export default function bd09togcj02(bd_lon, bd_lat) {
  const x = bd_lon - 0.0065
  const y = bd_lat - 0.006
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI)
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI)
  const gg_lng = z * Math.cos(theta)
  const gg_lat = z * Math.sin(theta)
  return [gg_lng, gg_lat]
}
