import path from 'path'
import fs from 'fs'
import { terser } from 'rollup-plugin-terser' // 压缩 js 代码
import scss from 'rollup-plugin-scss'
import VuePlugin from 'rollup-plugin-vue'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

const configure = (name) => {
  let config = []

  if (fs.existsSync(`packages/${name}/src/index.js`)) {
    config = genereteJsConfig(name)
  }

  return config
}

const genereteJsConfig = (name) => {
  const paths = {
    input: `packages/${name}/src/index.js`,
    output: `packages/${name}/lib`,
  }
  // 不需要提示的警告码
  const unwarnCode = [
    'CIRCULAR_DEPENDENCY', // 循环依赖
    'UNRESOLVED_IMPORT', // 未解析的依赖项（https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency）
    'THIS_IS_UNDEFINED', // 引用未定义（https://rollupjs.org/guide/en/#error-this-is-undefined）
    'EMPTY_BUNDLE', // scss 必定会报的警告，不知道什么问题
  ]

  // 拦截警告信息
  const onwarn = (warning, rollupWarn) => {
    // 跳过不需要提示的警告
    if (!unwarnCode.includes(warning.code)) {
      // console.warn(warning.code);
      rollupWarn(warning)
    }
  }
  // plugins 需要注意引用顺序
  const getPlugins = (format) => {
    // 是否为 umd 打包方式
    const isUmd = format === 'umd'
    return [
      VuePlugin({
        cssModulesOptions: {
          generateScopedName: '[local]___[hash:base64:5]',
        },
      }),
      scss(),
      commonjs(),
      resolve({
        // 将自定义选项传递给解析插件
        customResolveOptions: {
          moduleDirectory: 'node_modules',
        },
      }),
      babel({
        runtimeHelpers: true,
        // 只转换源代码，不运行外部依赖
        exclude: 'node_modules/**',
      }),
      isUmd && terser(),
    ]
  }

  const setRollupMethod = (output, format) => {
    return {
      input: paths.input,
      output: {
        file: path.join(paths.output, output),
        format: format,
        name,
        globals: {
          vue: 'vue',
          jszip: 'jszip',
        },
      },
      external: ['vue', 'jszip'], // 指出应将哪些模块视为外部模块
      plugins: getPlugins(),
      onwarn,
    }
  }
  // rollup 配置项
  const rollupConfig = [
    setRollupMethod('index.esm.js', 'es'),
    setRollupMethod('index.umd.min.js', 'umd'),
  ]
  console.log('11111111111', rollupConfig)
  return rollupConfig
}

export default configure
