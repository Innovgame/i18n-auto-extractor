import {reactive} from 'vue'

const langSet = reactive({
        lang:'zh-CN',
        langMap:null
})
export const useVueAt=()=>{
    const setCurrentLang=(lang,langMap)=>{
       langSet.lang=lang
       langSet.langMap=langMap
       globalThis.__CURRENT_LANG_SET__ = langSet;
    }
    if(!globalThis.__CURRENT_LANG_SET__){
        setCurrentLang('zh-CN',{})
    }
   return {
    setCurrentLang,
    langSet
   }
}