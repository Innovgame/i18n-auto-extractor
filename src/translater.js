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

export const $at11 = (zhText: string, options?: Record<string, any>) => {
    const md5Str = CryptoJS.MD5(zhText).toString().slice(0, 10);
    let text = lang.value === 'en' ? (enJson as any)[md5Str] || zhText : zhText;
    if (options) {
        Object.keys(options).forEach(key => {
            text = text.replace(new RegExp(`\{\\s*${key}\\s*\}`, 'g'), options[key])
        })
    }
    return text
}
export const $at = (zhText, options=undefined) => {
    const langSet = globalThis.__CURRENT_LANG_SET__ || {};
    let text = zhText;
    if(langSet.langMap && langSet.lang && langSet.lang !=='zh-CN'){
        const key = getFirstKey(langSet.langMap) || ''
        const md5Str =key? md5(zhText).slice(0, key.length): '';
        text = langSet.langMap[md5Str] || zhText;
    }
    if (options) {
        if(options.override && langSet.lang && options.override[langSet.lang]){
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
