import fs from 'fs'
import configure from './configure.js'
const packList = ['utils'] // 指定打包的包名
// const packList = []  // 空为全打包

export default () => {
  let configs = []
  for (const name of fs.readdirSync('packages')) {
    if (packList.length) {
      if (!packList.includes(name)) continue
    }
    configs = configs.concat(configure(name))
  }
  return configs
}
