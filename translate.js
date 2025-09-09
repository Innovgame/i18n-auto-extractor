/* eslint-disable prettier/prettier */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import chalk from 'chalk'
import ora from 'ora'
import {getTranslator} from './translator.js'

const getContentMd5 = (content,config) => {
    const hash = crypto.createHash('md5');
    hash.update(content);
    const hashHex = hash.digest('hex');
    return hashHex.slice(0, config.keyCount);
}

const translate = (zhs,lang,config) => {
    const translator = getTranslator(config,{from: 'zh-CN', to: lang, forceBatch: false})
    return translator.translate(zhs)
        .then((res) =>res.map(item=>item.text))
}


const zhSet = new Set()

function ensureFileExists(filePath, content = '') {
  try {
    if(fs.existsSync(filePath)) return
    // 获取目标文件的目录路径
    const dir = path.dirname(filePath);
    
    // 递归创建目录（如果不存在）
    fs.mkdirSync(dir, { recursive: true });
    
    // 创建文件（如果不存在）
    fs.writeFileSync(filePath, content, { flag: 'wx' });
  } catch (err) {
    console.error('创建文件失败：', err);
  }
}

const updateLangFile = async (config,lang) => {
    const i18nLocales = path.resolve(process.cwd(), config.localePath)
    const zhJsonPath = path.join(i18nLocales, 'zh-CN.json')
    const toJsonPath = path.join(i18nLocales, `${lang}.json`)
    ensureFileExists(zhJsonPath)
    ensureFileExists(toJsonPath)
    const zhJson = JSON.parse(fs.readFileSync(zhJsonPath, 'utf-8') || '{}')
    const toJson = JSON.parse(fs.readFileSync(toJsonPath, 'utf-8') || '{}')
    const untranslates = []
    const keys = []
    for (const zh of zhSet) {
        const key = getContentMd5(zh,config)
        keys.push(key)
        if (!zhJson[key]) {
            zhJson[key] = zh
        }
        if (!toJson[key]) {
            untranslates.push({
                key,
                zh
            })
        }
    }
    if(!config.onlyExtract && untranslates.length > 0){
        const result = await translate(untranslates.map(t => t.zh),lang,config)
        untranslates.forEach((item, index) => {
            toJson[item.key] = result[index]
        })
    }
    const nextzh = {}
    const nexten = {}
    keys.forEach(key => {
        nextzh[key] = zhJson[key]
        nexten[key] = toJson[key]
    })
    fs.writeFileSync(toJsonPath, JSON.stringify(nexten, null, 2))
    fs.writeFileSync(zhJsonPath, JSON.stringify(nextzh, null, 2))
}

function traverseDirectory(dir, callback) {
   const files= fs.readdirSync(dir, { withFileTypes: true }) 
    files.forEach(file => {
        const filePath = path.join(dir, file.name);

        if (file.isDirectory()) {
            // 如果是目录，递归遍历
            traverseDirectory(filePath, callback);
        } else {
            // 如果是文件，执行回调函数
            callback(filePath, file);
        }
    });
}
const spinner = ora();
export async function startTranslate(config){
    let startMsg= '中文提取中...'
    if(!config.onlyExtract){
        const needLadder =  config.translateBy === 'google';
        startMsg=needLadder?'中文提取翻译中，请确保能科学上网...':'中文提取翻译中...'
    }
    spinner.start(startMsg);
    traverseDirectory(path.resolve(process.cwd(), config.scanPath), (id) => {
    if (id.match(new RegExp(`\.(${config.fileType})$`))) {
            const code = fs.readFileSync(id, 'utf-8')
            const matches = Array.from(code.matchAll(/\$at\(\s*(['"])(.*?)\1/g))
            if (!matches.length) return
            matches.forEach((item) => {
                zhSet.add(item[2])
            })
        }
    });
    try{
        for(let i=0;i<config.langs.length;i++){
            await updateLangFile(config,config.langs[i])
        }
        spinner.stop();
        console.log(chalk.greenBright('操作成功～'))
    }catch(e){
        spinner.stop();
        console.error(e)
        console.log(chalk.redBright('翻译失败😔'))
    }
}

