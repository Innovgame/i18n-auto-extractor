import md5 from 'js-md5';

export const setCurrenLang=(lang,langMap)=>{
    globalThis.__CURRENT_LANG_SET__ = {
        lang,
        langMap,
    };
}
export const $at = (zhText, options=undefined) => {
    if(!globalThis.__CURRENT_LANG_SET__) return zhText;
    const { langMap } = globalThis.__CURRENT_LANG_SET__;
    const md5Str = md5(zhText).slice(0, 10);
    let text = langMap?.[md5Str] || zhText;
    if (options) {
        Object.keys(options).forEach(key => {
            text = text.replace(new RegExp(`\{\\s*${key}\\s*\}`, 'g'), options[key])
        })
    }
    return text
}
