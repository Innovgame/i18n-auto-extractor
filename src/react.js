import {useCallback, useState} from 'react'
import {$at} from './translater'

export const useReactAt=()=>{
    const [langSet,setLangSet] = useState({
        lang:'zh-CN',
        langMap:null
    })
    const setCurrentLang=useCallback((lang,langMap)=>{
        const set={
            lang,
            langMap
        }
        setLangSet(set)
        globalThis.__CURRENT_LANG_SET__ = {
            lang,langMap
        };
    },[])

    const _$at = useCallback((zhText, options=undefined) => {
        return $at(zhText, options)
    },[langSet])

   return {
        setCurrentLang,
        $at:_$at,
        langSet
   }
}


