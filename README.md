## i18n-auto-extractor
一款极轻量的i18n自动化解决方案工具，主要功能为自动提取项目中的中文，并翻译成多种语言，借助谷歌翻译接口，支持上百种语言。
支持在react，vue甚至原生工程内使用。

### 使用方式
1. 安装依赖包
<br />
```npm i i18n-auto-extractor```

2. 运行命令在项目根目录下自动生成配置文件".i18n_extractor.json"
<br />
```npx i18n-auto-extractor```

3. “.i18n_extractor.json”配置文件结构
```
{
  // 国际化语种列表，iso国际代码,参考：https://cloud.google.com/translate/docs/languages?hl=zh-cn
  "langs": [
    "en",
    "fr"
  ],
  // 提取中文的时候扫描的文件夹范围
  "scanPath": "src",
  // 提取中文的时候扫描的文件类型
  "fileType": "vue|ts|js|jsx|tsx",
  // 国际化文件保存路径
  "localePath": "src/locales",
  // 翻译json的md5 key长度
  "keyCount": 10
}
```
4. 工具会自动扫描文件中使用```$at```函数包裹的文案，注意文案中不能包含变量，文案是静态提取的，例如以下写法能够提取。
```
$at('你好')
$at('你好{x}',{x:'Jan'})
```

5. 响应式切换语言
- 在原生工程中,建议替换语言后直接刷新页面
```
 <div id="textDisplay"></div>
<script src="../dist/umd/index.min.js"></script>
<script type="module">
    // 页面首次渲染加载对应的语言文件，切换语言后刷新页面，加载其他语言文件
    window.i18nExtractor.setCurrentLang('en',enJson)
    textDisplay.textContent=window.i18nExtractor.$at('你好')
</script>
```

- 在vue3项目中
-- 切换语言案例
```
 <script setup>
import {useVueAt} from 'i18n-auto-extractor/vue'
import {$at} from 'i18n-auto-extractor'
import enJSON from '@/locales/en'

const {setCurrentLang}=useVueAt()

setTimeout(() => {
  setCurrentLang('en',enJSON)
}, 3000);
</script>

<template>
  <div>
   {{$at('你好')}}
  </div>
</template>
```
-- 计算属性响应文案变化
```
const name=computed(()=>{
    return $at('你好')
})
```

-- vite/webpack项目最佳实践，通过auto-import插件自动引用```$at```，国际化函数基本每个文件都会使用，自动导入显著提升开发体验。
```
 AutoImport({
        imports: [{
           // 自动引入 $at
          'i18n-auto-extractor': ['$at']
        }],
        dts: 'types/auto-import.d.ts',
        vueTemplate: true, // 需要开启模板检测
        ...
 })
```

- 在react项目中
-- 切换语言案例
```
import {useReactAt} from 'i18n-auto-extractor/react'
import enJSON from '../../locales/en.json'
import './App.css'

function App() {
  // $at经过useCallback包裹，已经是响应式的了
   const {setCurrentLang,$at,langSet}= useReactAt()

  useEffect(()=>{
    setTimeout(() => {
      setCurrentLang('en',enJSON)
    }, 3000);
  },[setCurrentLang])

  return (
    <>
      {$at('你好')}
    </>
  )
}
```

6. 自定义翻译文案
有时候对翻译结果不满意需要修改，可以直接改翻译文件中的文案。
注意：中文内容变更会导致对应的翻译内容自动清除，每次翻译后尽量通过git对比前后差异，避免部分自定义文案被误删。

7. 问题沟通交流
本工具最初只在公司内部使用，经历了两次功能革新，第一版支持国际化文案自动翻译，第二版支持中文自动提取，并且内部在vue3项目中使用，react使用较少，有问题欢迎交流。
