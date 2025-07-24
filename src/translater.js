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
        Object.keys(options).forEach(key => {
            text = text.replace(new RegExp(`\{\\s*${key}\\s*\}`, 'g'), options[key])
        })
    }
    return text
}
