# 🌍 i18n-auto-extractor - 自动化多语言解决方案

[![npm version](https://img.shields.io/npm/v/i18n-auto-extractor)](https://www.npmjs.com/package/i18n-auto-extractor)
[![license](https://img.shields.io/npm/l/i18n-auto-extractor)](https://github.com/your-repo/i18n-auto-extractor/blob/main/LICENSE)

一款极轻量、高效的国际化(i18n)自动化工具，支持**智能提取中文文案**并**自动翻译成100+语言**，完美适配Vue/React/原生项目。

## ✨ 核心特性

- **一键提取**：自动扫描项目中的中文文案
- **智能翻译**：集成Google翻译接口，支持100+语言
- **无缝集成**：支持Vue3、React及原生项目
- **响应式切换**：实时更新多语言内容
- **开发友好**：提供自动导入配置方案
- **支持只提取中文**：只提取出中文json，然后扔给ai自动翻译，这也许是更好的选择
- **支持使用百度翻译**：谷歌翻译是默认翻译器，主要是它不需要额外配置，也可使用百度翻译，需要获取apikey和密钥

## 🚀 快速开始

### 安装

```bash
npm install i18n-auto-extractor
# 或
yarn add i18n-auto-extractor
```

### 初始化配置

```bash
npx i18n-auto-extractor
```

这将生成配置文件 `.i18n_extractor.json`：

```json
{
  "langs": ["en", "fr", "ja"],  // 目标语言列表(ISO代码)
  "scanPath": "src",            // 扫描目录
  "fileType": "vue|ts|js|jsx|tsx",  // 文件类型
  "localePath": "src/locales",  // 语言文件存放路径
  "keyCount": 10,                // 翻译键长度
  "translateBy": "baidu",        // 翻译器类型 baidu | google
  "baidu": {
    "appid": "20241022002182439", // 百度翻译开放平台appid
    "secret": "54E2s423WiHcD7_qLOLx" // 百度翻译开放平台密钥
  }
}
```

## 🔍 文案提取规则

工具会自动提取以下格式的中文文案（需静态文本）：

```javascript
$at('你好')                    // 简单文本
$at('你好{x}', {x: 'Jan'})     // 带参数的文本
```

> ⚠️ 注意：文案中不能包含变量，仅支持静态提取

## 🛠 使用指南

### 🌐 原生项目使用

```html
<div id="textDisplay"></div>
<script src="../dist/umd/index.min.js"></script>
<script>
  // 设置语言并显示文本
  window.i18nExtractor.setCurrentLang('en', enJson)
  textDisplay.textContent = window.i18nExtractor.$at('你好')
</script>
```

### 🖖 Vue3 项目集成

```vue
<script setup>
import { $at } from 'i18n-auto-extractor'
import { useVueAt } from 'i18n-auto-extractor/vue'
import enJSON from '@/locales/en'

const { setCurrentLang } = useVueAt()

// 3秒后切换语言
setTimeout(() => setCurrentLang('en', enJSON), 3000)
</script>

<template>
  <div>{{ $at('你好') }}</div>
</template>
```

#### 自动导入配置（推荐）

```javascript
// vite.config.js
import AutoImport from 'unplugin-auto-import/vite'

export default {
  plugins: [
    AutoImport({
      imports: [
        {
          'i18n-auto-extractor': ['$at'] // 自动引入$at函数
        }
      ],
      dts: 'types/auto-import.d.ts',
      vueTemplate: true
    })
  ]
}
```

### ⚛️ React 项目集成

```jsx
import { useReactAt } from 'i18n-auto-extractor/react'
import enJSON from '../../locales/en.json'

function App() {
  const { setCurrentLang, $at } = useReactAt()

  useEffect(() => {
    setTimeout(() => setCurrentLang('en', enJSON), 3000)
  }, [])

  return <>{$at('你好')}</>
}
```
## 🪛 修改翻译后的文案
- 翻译后的文案有时候不满足，需要手动修改，可以直接修改json文件
- 因为是增量翻译，不用担心被覆盖，除非手动将翻译记录删除，才会重新翻译
```json
{
  "7eca689f0d": "Hello",
  "76687749ee": "What's the weather like today?", // 直接更改翻译文案
  "38cf16f220": "Sure"
}
```
## 🔄 一词多译
- 通过override配置支持覆盖指定语言场景下的翻译，如下确定文案在英文中的一词多译，
- override作为内容的保留属性，在参数化翻译中不要使用
- 在vue模板语法中注意对象字面量书写规则，'}}'写成'} }'

```vue
   <div>{{$at('确定')}}</div>
   <div>{{ $at('确定', { override: { en: 'ok' } }) }}</div>
   <div>{{ $at('确定', { override: { en:'confirm' } }) }}</div>
```

## 💡 最佳实践

- 使用`$at()`包装所有需要国际化的文本
- 通过Git管理语言文件变更
- 定期检查自动翻译结果，优化关键文案

## 🤝 交流与支持

本工具已在公司内部多个Vue3项目中稳定运行，React支持相对较新。遇到问题欢迎在[GitHub Issues](https://github.com/qianyuanjia/i18n-auto-extractor/issues)反馈。

---

📌 **License**: MIT  
🌎 **项目地址**: [GitHub Repo](https://github.com/qianyuanjia/i18n-auto-extractor)  
