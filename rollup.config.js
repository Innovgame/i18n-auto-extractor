import terser from '@rollup/plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const plugins=[
    resolve(),
    commonjs() 
  ]
// 多格式输出配置
// @type {import('rollup').RollupOptions}
export default [{
  input: 'src/index.js', // 入口文件
  output: [
    // ESM 格式 (现代浏览器和打包工具)
    {
      dir: 'dist/esm',
      format: 'esm',
    //   preserveModules: true, // 保持文件结构
      entryFileNames: '[name].mjs',
    },
    // CommonJS 格式 (Node.js)
    {
      dir: 'dist/cjs',
      format: 'cjs',
      exports: 'auto', // 自动检测导出方式
      entryFileNames: '[name].cjs',
    },
    // UMD 格式 (浏览器全局变量)
    {
      file: 'dist/umd/index.min.js',
      format: 'umd',
      name: 'i18nExtractor', // 全局变量名 (如 window.YourLib)
      plugins: [terser()], // 代码压缩
    },
  ],
  plugins,
},{
    input: 'src/vue.js', // 入口文件
  output: [
    // ESM 格式 (现代浏览器和打包工具)
    {
      dir: 'dist/esm',
      format: 'esm',
    //   preserveModules: true, // 保持文件结构
      entryFileNames: '[name].mjs',
    },
    // CommonJS 格式 (Node.js)
    {
      dir: 'dist/cjs',
      format: 'cjs',
      exports: 'auto', // 自动检测导出方式
      entryFileNames: '[name].cjs',
    },
  ],
  plugins,
},{
    input: 'src/react.js', // 入口文件
  output: [
    // ESM 格式 (现代浏览器和打包工具)
    {
      dir: 'dist/esm',
      format: 'esm',
    //   preserveModules: true, // 保持文件结构
      entryFileNames: '[name].mjs',
    },
    // CommonJS 格式 (Node.js)
    {
      dir: 'dist/cjs',
      format: 'cjs',
      exports: 'auto', // 自动检测导出方式
      entryFileNames: '[name].cjs',
    },
  ],
  plugins,
},
{
  input: 'index.js', // 入口文件
  output: [
    // CommonJS 格式 (Node.js)
    {
      dir: 'dist',
      format: 'esm',
      exports: 'auto', // 自动检测导出方式
      entryFileNames: '[name].js',
    },
  ],
  plugins:[],
}];