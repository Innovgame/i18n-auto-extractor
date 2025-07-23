/* eslint-disable prettier/prettier */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import chalk from 'chalk'
import ora from 'ora'

const getContentMd5 = (content,config) => {
    const hash = crypto.createHash('md5');
    hash.update(content);
    const hashHex = hash.digest('hex');
    return hashHex.slice(0, config.keyCount);
}

const translate = (zhs,lang) => {
    return fetch('https://translate-pa.googleapis.com/v1/translateHtml', {
        headers: {
            accept: '*/*',
            'accept-language': 'zh-CN,zh;q=0.9',
            'cache-control': 'no-cache',
            'content-type': 'application/json+protobuf',
            pragma: 'no-cache',
            priority: 'u=1, i',
            'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'x-client-data':
                'CJO2yQEIo7bJAQipncoBCN6FywEIlaHLAQjzossBCIagzQEIk8bOAQiHyc4BCIjMzgEYwcvMAQ==',
            'x-goog-api-key': 'AIzaSyATBXajvzQLTDHEQbcpq0Ihe0vWDHmO520',
            Referer: 'http://localhost:5173/',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        },
        body: JSON.stringify([[zhs, 'zh-CN', lang], 'te']),
        method: 'POST'
    })
        .then((res) => res.json())
        .then((res) => {
            return res?.[0] || []
        })
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
    try {
        const result = await translate(untranslates.map(t => t.zh),lang)
        untranslates.forEach((item, index) => {
            toJson[item.key] = result[index]
        })
        const nextzh = {}
        const nexten = {}
        keys.forEach(key => {
            nextzh[key] = zhJson[key]
            nexten[key] = toJson[key]
        })
        fs.writeFileSync(toJsonPath, JSON.stringify(nexten, null, 2))
        fs.writeFileSync(zhJsonPath, JSON.stringify(nextzh, null, 2))
    } catch (e) {
        console.error(e)
        console.log(chalk.redBright('翻译失败，请检查是否没有科学上网？'))
    }

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
     spinner.start("中文提取翻译中，请确保能科学上网...");
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
    for(let i=0;i<config.langs.length;i++){
        await updateLangFile(config,config.langs[i])
    }
    spinner.stop();
    console.log(chalk.greenBright('自动翻译完成～'))
}

