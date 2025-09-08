import md5 from 'js-md5';

export const setCurrentLang=(lang,langMap)=>{
    globalThis.__CURRENT_LANG_SET__ = {
        lang,
        langMap,
    };
}

function getFirstKey(obj) {
  for (const key in obj) {
    return key;
  }
}

export const $at = (zhText, options=undefined) => {
    const langSet= globalThis.__CURRENT_LANG_SET__;
    if(!langSet || langSet.lang==='zh-CN' || !langSet.langMap) return zhText;
    const key = getFirstKey(langSet.langMap) || ''
    const md5Str =key? md5(zhText).slice(0, key.length): '';
    let text = langSet.langMap[md5Str] || zhText;
    if (options) {
        if(options.override && options.override[langSet.lang]){
            text = options.override[langSet.lang]
        }
        Object.keys(options).forEach(key => {
            if(key !== 'override'){
                text = text.replace(new RegExp(`\{\\s*${key}\\s*\}`, 'g'), options[key])
            }
        })
    }
    return text
}
