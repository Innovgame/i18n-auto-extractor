import {useCallback, useState} from 'react'
import {$at} from './translater'

export const useReactAt=()=>{
    const [langSet,setLangSet] = useState(globalThis.__CURRENT_LANG_SET__)
    const setCurrentLang=useCallback((lang,langMap)=>{
        const set={
            lang,
            langMap
        }
        globalThis.__CURRENT_LANG_SET__ = set
        setLangSet(set)
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


