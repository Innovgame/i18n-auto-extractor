
import { Translator  as GoogleTranslator} from 'google-translate-api-x';
import md5 from 'js-md5';
import {baiduLangMap} from './lang_iso.js'

class BaiduTranslator{
  constructor(config, options) {
    this.config = config
    this.options = options
    this.options.from=this.getLang(this.options.from)
    this.options.to=this.getLang(this.options.to)
  }
  getLang(lang) {
    return baiduLangMap[lang] || lang
  }
  generateSign(q, salt) {
    return md5(this.config.baidu.appid + q + salt + this.config.baidu.secret);
  }
  async translate(zhs) {
    const salt = Date.now();
    const text = zhs.join('\n')
    const sign = this.generateSign(text, salt);
    
    const response = await fetch('https://fanyi-api.baidu.com/api/trans/vip/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: new URLSearchParams({
            q: text,
            from: this.options.from,
            to: this.options.to,
            appid: this.config.baidu.appid,
            salt,
            sign
        })
    }).then(res=>res.json());
    if(response.error_code){
      if(response.error_code==='58001'){
        throw new Error(`百度翻译不支持语言：${this.options.to}, 请使用谷歌翻译`)
      }else{
        throw new Error(`百度翻译错误：${response.error_code}, ${response.error_msg}`)
      }
    }
    response.trans_result
    .forEach((item) => {
      item.text=item.dst
    }) 
    return response.trans_result
  }
}

export const getTranslator= (config,params)=> {
   if(config.translateBy === 'baidu'){
      return new BaiduTranslator(config, params);
   }
   return new GoogleTranslator(params);
}