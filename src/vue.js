import {reactive} from 'vue'

export const useVueAt=()=>{
    const langSet = reactive({
        lang:'zh-CN',
        langMap:null
    })
    const setCurrentLang=(lang,langMap)=>{
       langSet.lang=lang
       langSet.langMap=langMap
       globalThis.__CURRENT_LANG_SET__ = langSet;
    }

   return {
    setCurrentLang,
    langSet
   }
}