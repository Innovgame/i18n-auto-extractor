import { $at, getCurrentLang, setCurrentLang } from './translater'
export const i18nAtPlugin = {
  install(Vue, options) {
    if(options.langSet){
        setCurrentLang(options.langSet.lang, options.langSet.langMap)
    }
    const store = Vue.observable({
        langSet: getCurrentLang(),
        setCurrentLang(lang,langMap) {
            setCurrentLang(lang,langMap)
            store.langSet = getCurrentLang()
        },
    });
    // 添加全局混入
    Vue.mixin({
        computed: {
            langSet(){
                return store.langSet
            }
        }
    });

    // 添加全局方法
    Vue.prototype.$at = $at
    Vue.prototype.setCurrentLang = store.setCurrentLang
  }
};

