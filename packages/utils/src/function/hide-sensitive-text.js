/**
 * @description: 隐藏敏感信息
 * @param str 需要处理的字符串
 * @param start 替换的起始位置
 * @param end 替换的截止位置
 * @param replaceStr 替换的字符串
 * @return 处理之后的字符串
 */
const hideSensitiveText = (str, start, end, replaceStr = '*') => {
  const subStrArr = str.split('')
  return [
    ...subStrArr.slice(0, start - 1),
    ...subStrArr.slice(start - 1, end).fill(replaceStr),
    ...subStrArr.slice(end),
  ].join('')
}
export default hideSensitiveText
