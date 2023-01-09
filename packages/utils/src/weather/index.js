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
export default function getWeather(
  cityCode = '330400',
  key = '442b97f4e1c843da3a75a18528868070',
  extensions = 'base'
) {
  return new Promise((resolve, reject) => {
    if (!key) {
      console.error('缺少高德key')
      reject('缺少高德key')
      return
    }
    if (!cityCode) {
      console.error('缺少城市编码')
      reject('缺少城市编码')
      return
    }
    fetch(
      `https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=${key}&extensions=${extensions}`
    )
      .then((res) => res.json())
      .then((res) => {
        const { infocode, info, count } = res
        if (infocode === '10000') {
          if (count > 0) {
            if (extensions === 'base') {
              resolve(res.lives[0])
            } else {
              resolve(res.forecasts[0])
            }
          } else {
            reject('无数据')
          }
        } else {
          console.error(info)
          reject(info)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}
