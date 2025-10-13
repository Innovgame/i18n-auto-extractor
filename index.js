#!/usr/bin/env node
import enquirer from "enquirer";
import fs from 'node:fs'
import path from 'node:path'
import {program} from 'commander'
import chalk from 'chalk'
// import {} from 'csv-reader'
import { createArrayCsvWriter } from 'csv-writer'
import {langIsoList} from "./lang_iso.js";
import {startTranslate} from './translate.js'
import packageJSON from './package.json' with { type: "json" };

const langIsoMap=langIsoList.reduce((pre,item)=>{
    pre[item.name]=item.value
    return pre;
},{})
async function prompt() {
  try {
    const answer = await enquirer.prompt([
      {
        type: "select",
        name: "langs",
        multiple: true,
        required: true,
        message: "需要将中文翻译为(默认英文):",
        choices:langIsoList
      },
      {
        type: "text",
        name: "scanPath",
        default: "src",
        message: "扫描的文件范围：",
      },
      {
        type: "text",
        name: "fileType",
        default: "vue|ts|js|jsx|tsx",
        message: "扫描的文件类型后缀：",
      },
      {
        type: "text",
        name: "localePath",
        default: "src/locales",
        message: "翻译文件存放路径：",
      },
      {
        type: "text",
        name: "keyCount",
        default: 10,
        message: "md5作为键截取前几位(过短可能导致键重复，最长32位)：",
      },
      {
        type: "confirm",
        name: "onlyExtract",
        default: false,
        message: "是否只提取中文不翻译",
      },
    ]);
    if(!answer.onlyExtract){
      Object.assign(answer,await enquirer.prompt({
        type: "select",
        name: "translateBy",
        required: true,
        default: "google",
        message: "选择翻译方式：",
        choices:[
          {name:'google',message:'谷歌翻译'},
          {name:'baidu',message:'百度翻译'},
        ]
      }))
      if(answer.translateBy==='baidu'){
         Object.assign(answer,{
          baidu:await enquirer.prompt([
            {
                type: "text",
                name: "appid",
                message: "百度翻译开放平台获取的APPID(https://api.fanyi.baidu.com/manage/developer):",
            },
             {
                type: "text",
                name: "secret",
                message: "百度翻译api密钥:",
            },
          ])
         })
      }
    }
    if(answer.langs.length===0){
       answer.langs.push('en') 
    }else{
       answer.langs = answer.langs.map(lang=>langIsoMap[lang])
    }
    answer.keyCount = parseInt(answer.keyCount)
    return answer;
  } catch (e) {
    console.log("Aborted.");
    process.exit(1);
  }
}

const configPath = path.resolve(process.cwd(), '.i18n_extractor.json')

async function generateConfig(){
  const answer= await prompt()
  fs.writeFileSync(configPath,JSON.stringify(answer,null,2))
  return answer
}
/**
 * 检测配置文件，没有需要生成
 */
async function getConfig(){
    if(!fs.existsSync(configPath)){
       return await generateConfig()
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
}

async function registerCommands(){
   program
    .name('i18n-auto-extractor')
    .description('i18n自动化翻译工具')
    .version(packageJSON.version)

  program
  .command('init')
  .description('初始化配置文件')
  .action(async () => {
    generateConfig()
  });

  program
  .command('at')
  .description('提取翻译文案')
  .action(async () => {
    const config = await getConfig()
    startTranslate(config)
  });

  program
  .command('export')
  .description('导出翻译结果CSV文件')
  .action(async () => {
    const config = await getConfig()
    const i18nLocales = path.resolve(process.cwd(), config.localePath)
    const langs=['zh-CN', ...config.langs]
    const csvPath=path.resolve(i18nLocales, 'i18n.csv')
    const csvWriter = createArrayCsvWriter({
      path: csvPath,
      header: ['hash', ...langs]
    })
    const langMap = {}
    langs.forEach(lang => {
      if(!langMap[lang]){
        langMap[lang] = JSON.parse(fs.readFileSync(path.join(i18nLocales, `${lang}.json`), 'utf8')  || '{}')
      }
    });
    const records = []
    for(const hash in langMap['zh-CN']){
      records.push([hash,...langs.map(lang=>langMap[lang][hash])])
    }
    csvWriter.writeRecords(records) // returns a promise
    console.log(chalk.greenBright('导出成功，请查看：'), chalk.blueBright(csvPath))
  });
  
  program.parse(process.argv)
}

await registerCommands()
