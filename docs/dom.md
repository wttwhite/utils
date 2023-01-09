# dom相关操作

## has-class

判断当前dom是否存在某classname

- @param el 当前dom
- @param cls 判断的classname

@return 是否存在入参的classname  true/false

```javascript
import { hasClass } from 'hsja-utils'
<div ref="utilsDom" class="a"></div>
hasClass(this.$refs.utilsDom, 'a')   // true
```

## add-class

为当前dom增加classname

- @param el 当前dom
- @param cls 增加的classname

@return  无

```javascript
import { addClass } from 'hsja-utils'
addClass(this.$refs.utilsDom, 'b') // 增加单个样式
addClass(this.$refs.utilsDom, 'c d') // 增加多个样式
```

## remove-class

为当前dom删除classname

- @param el 当前dom
- @param cls 删除的classname

@return  无

```javascript
import { removeClass } from 'hsja-utils'
removeClass(this.$refs.utilsDom, 'b') // 删除单个样式
removeClass(this.$refs.utilsDom, 'c d') // 删除多个样式
```

## toggle-class

判断当前dom是否有输入的classname，有则删除，无则增加

- @param el 当前dom
- @param cls 增删的classname

@return  无

```javascript
import { toggleClass } from 'hsja-utils'
<div ref="utilsDom" class="a"></div>
toggleClass(this.$refs.utilsDom, 'a') // 删除a
toggleClass(this.$refs.utilsDom, 'b') // 增加a
```
