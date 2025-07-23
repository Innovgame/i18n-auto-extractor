#!/usr/bin/env node
import enquirer from "enquirer";
import fs from 'node:fs'
import path from 'node:path'
import {langIsoList} from "./lang_iso.js";
import {startTranslate} from './translate.js'

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
    ]);
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
/**
 * 检测配置文件，没有需要生成
 */
async function prepare(){
    if(!fs.existsSync(configPath)){
       const answer= await prompt()
       fs.writeFileSync(configPath,JSON.stringify(answer,null,2))
       return answer
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
}

const config=await prepare()
startTranslate(config)