import {useCallback, useEffect, useState} from 'react'
import {$at} from './translater'

class EventBus {
  constructor() {
    this.events = new Map();
  }

  /**
   * 订阅事件
   * @param {string} eventName 事件名称
   * @param {Function} callback 回调函数
   * @param {Object} [options] 选项
   * @param {boolean} [options.once=false] 是否只触发一次
   * @returns {Function} 取消订阅函数
   */
  on(eventName, callback, options = {}) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    const { once = false } = options;
    const handlers = this.events.get(eventName) || [];
    handlers.push({ callback, once });
    this.events.set(eventName, handlers);

    // 返回取消订阅函数
    return () => this.off(eventName, callback);
  }

  /**
   * 取消订阅
   * @param {string} eventName 事件名称
   * @param {Function} [callback] 要移除的特定回调，不传则移除所有回调
   */
  off(eventName, callback) {
    if (!this.events.has(eventName)) return;

    if (!callback) {
      // 移除该事件的所有监听器
      this.events.delete(eventName);
    } else {
      // 只移除特定的回调
      const handlers = this.events.get(eventName)
        .filter(handler => handler.callback !== callback);
      
      if (handlers.length) {
        this.events.set(eventName, handlers);
      } else {
        this.events.delete(eventName);
      }
    }
  }

  /**
   * 触发事件
   * @param {string} eventName 事件名称
   * @param {...any} args 传递给回调函数的参数
   */
  emit(eventName, ...args) {
    if (!this.events.has(eventName)) return;

    const handlers = this.events.get(eventName);
    const handlersToKeep = [];

    for (const handler of handlers) {
      try {
        handler.callback(...args);
      } catch (err) {
        console.error(`Error executing callback for event "${eventName}":`, err);
      }

      // 如果不是once订阅，则保留
      if (!handler.once) {
        handlersToKeep.push(handler);
      }
    }

    if (handlersToKeep.length) {
      this.events.set(eventName, handlersToKeep);
    } else {
      this.events.delete(eventName);
    }
  }

  /**
   * 清除所有事件监听
   */
  clear() {
    this.events.clear();
  }
}

const bus = new EventBus();
let _langSet= {
                    lang:'zh-CN',
                    langMap:{}
                }

export const useReactAt=()=>{
    if(!globalThis.__CURRENT_LANG_SET__){
        Object.defineProperty(globalThis, '__CURRENT_LANG_SET__', {
            get() {
                return _langSet
            },
            set(value) {
                // 触发一个notify
                _langSet=value
                bus.emit('lang_set', value);
            },
        });
    }
    
    const [langSet,setLangSet] = useState(globalThis.__CURRENT_LANG_SET__)
    const setCurrentLang=useCallback((lang,langMap)=>{
        globalThis.__CURRENT_LANG_SET__ = {
            lang,
            langMap
        }
    },[])

    const _$at = useCallback((zhText, options=undefined) => {
        return $at(zhText, options)
    },[langSet])

    useEffect(()=>{
        const unsubscribe = bus.on('lang_set', value => {
            setLangSet(value)
        });
        return () => {
            unsubscribe();
        };
    },[])

   return {
        setCurrentLang,
        $at:_$at,
        langSet
   }
}


