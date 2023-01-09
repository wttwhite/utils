# 正则

```javascript
import { regExp } from 'hsja-utils'
regExp.number.test('啊啊啊') // false
regExp.number.test(123456) // true
regExp.number // /^\d*$/   输出对应变量的正则
```

| 变量           | 描述                                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| ip             | IP地址                                                                                                |
| port           | 端口号(0～65535)                                                                                      |
| email          | 邮箱                                                                                                  |
| macAddr        | mac地址                                                                                               |
| number         | 数字                                                                                                  |
| naturalNum     | 自然数，包括0                                                                                         |
| positiveNum    | 正整数                                                                                                |
| name           | 姓名，不包含特殊字符                                                                                  |
| personName     | 姓名，数字、字母、汉字、间隔号（·）和空格（1-128位）                                                 |
| phoneNum       | 手机号，数字（1-11位）                                                                                |
| IDNumber       | 证件号码，数字、大小写字母（0-20位）                                                                  |
| identityCard   | 身份证号，前17位为数字，尾号为数字或大写字母X（18位），严格校验模式使用函数操作中的严格身份证校验函数 |
| password       | 密码，至少由大写字母、小写字母、数字、特殊字符任意两种组成。（8-16位）                                |
| cardNum        | 卡号，只能用数字和大写字母（8-18位）                                                                  |
| simplePassword | 数字 「卡密码」「胁迫密码」「超级密码」（4-8位）                                                      |
| uuid           | 大小写英文字母、数字、连接符（32位）                                                                  |
| licenseNumber  | 车牌号非特殊字符（1-16位）                                                                            |
| numAndCN       | 字母、汉字的组合                                                                                      |
| numLetterAndCN | 字母、数字、汉字的组合                                                                                |
| numLetter      | 字母、数字的组合                                                                                      |
| deviceUserName | 设备登录用户名，只能用字母、数字、汉字、小数点、下划线、连接符                                        |
| deviceCode     | 字母、数字、汉字、小数点、下划线、连接符 [设备编码]                                                   |
| deviceType     | 只能用字母、数字、汉字、小数点、下划线、连接符、括号 「设备型号」                                     |
| deviceAccount  | 字母、数字和除:\"之外的特殊字符 「设备账号1-32位」                                                    |
