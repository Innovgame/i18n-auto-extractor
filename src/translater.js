import md5 from 'js-md5';

export const setCurrentLang=(lang,langMap)=>{
    globalThis.__CURRENT_LANG_SET__ = {
        lang,
        langMap,
    };
}
export const $at = (zhText, options=undefined) => {
    const langSet= globalThis.__CURRENT_LANG_SET__;
    if(!langSet || langSet.lang==='zh-CN' || !langSet.langMap) return zhText;
    const md5Str = md5(zhText).slice(0, 10);
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
